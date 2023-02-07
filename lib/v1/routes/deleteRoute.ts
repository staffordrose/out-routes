import flatten from 'lodash.flatten';

import { ActivityActions } from '@/data/activity';
import { databaseSchema, DatabaseSchemaKey } from '@/data/db';
import {
  RouteActions,
  routeActions,
  RouteFeatureActions,
  routeFeatureActions,
} from '@/data/routes';
import { Contributor, Favorite, Route, User } from '@/types';
import { StatusError } from '@/utils';
import { getXataClient } from '@/xata';
import { deleteFeatureImage, deleteRouteImages } from '../uploads';
import { deleteActivityRecords } from '../user';

export const deleteRoute = async (
  authUser: Pick<User, 'id'> & Partial<User>,
  username: User['username'],
  slug: Route['slug']
): Promise<void> => {
  try {
    // username is missing
    if (!username) {
      throw new StatusError(
        400,
        `A valid username is required to delete the route`
      );
    }

    // slug is missing
    if (!slug) {
      throw new StatusError(
        400,
        `A route slug is required to delete the route`
      );
    }

    const xata = getXataClient();

    const route = await xata.db.routes
      .filter({ 'owner.username': username, slug })
      .select(['owner.id', 'fork_id', 'image_id'])
      .getFirst();

    // route does not exist
    if (!route) {
      throw new StatusError(
        404,
        `A route does not exist for the provided username and slug`
      );
    }

    // route owner is missing
    if (!route.owner) {
      throw new StatusError(400, `The route does not have an owner`);
    }

    // auth user is not the owner
    if (authUser.id !== route.owner.id) {
      throw new StatusError(403, `Only the route owner can delete a route`);
    }

    /**
     * TODO: Also delete:
     * route_member_invites
     * route_pulls
     * route_pull_items
     * route_pull_comments
     * route_threads
     * route_thread_comments
     * route image
     * feature images
     */

    const [
      forkedRoutes,
      route_favorites,
      route_contributors,
      route_members,
      route_commits,
      route_features,
      route_layers,
    ] = await Promise.all([
      // forked routes
      xata.db.routes.filter('fork_id', route.id).select(['id']).getAll(),
      // route_favorites
      xata.db.route_favorites
        .filter('route.id', route.id)
        .select(['id', 'user.stats_favorites'])
        .getAll(),
      // route_contributors
      xata.db.route_contributors
        .filter('route.id', route.id)
        .select(['id', 'user.stats_commits'])
        .getAll(),
      // route_members
      xata.db.route_members
        .filter('route.id', route.id)
        .select(['id'])
        .getAll(),
      // route_commits
      xata.db.route_commits
        .filter('route.id', route.id)
        .select(['id'])
        .getAll(),
      // route_features
      xata.db.route_features
        .filter('route.id', route.id)
        .select(['id', 'image_id'])
        .getAll(),
      // route_layers
      xata.db.route_layers.filter('route.id', route.id).select(['id']).getAll(),
    ]);

    // route_commit_items
    const route_commit_items = flatten(
      await Promise.all(
        (route_commits || []).map((commit) =>
          xata.db.route_commit_items
            .filter('commit.id', commit.id)
            .select(['id', 'action', 'payload'])
            .getAll()
        )
      )
    );

    // update forked routes
    if (Array.isArray(forkedRoutes) && forkedRoutes.length) {
      await Promise.all(
        forkedRoutes.map(({ id }) =>
          xata.db.routes.update(id, {
            fork_id: null,
            fork_commit_id: null,
          })
        )
      );
    }

    let routeFavoritesUserStats = route_favorites || [];

    type ContributionCount = {
      contributor: Contributor;
      count: number;
    };

    // group users by how many contributions they made to the route
    const routeCommitsUserStats = (route_contributors || []).reduce(
      (accum, curr) => {
        if (!curr.user?.id) return accum;

        const filter = ({ contributor }: ContributionCount) =>
          contributor.user?.id === curr.user?.id;

        if (accum.some(filter)) {
          const existing = accum.find(filter) as ContributionCount;

          accum.push({ contributor: curr, count: existing.count++ });
        } else {
          accum.push({ contributor: curr, count: 1 });
        }

        return accum;
      },
      [] as ContributionCount[]
    );

    if (routeFavoritesUserStats.length || routeCommitsUserStats.length) {
      // remove auth user from routCommitsUserStats
      const authUserRouteCommitsUserStats =
        (routeCommitsUserStats || []).find(
          ({ contributor }) => contributor.user?.id === authUser.id
        ) || ({} as ContributionCount);

      const restRouteCommitsUserStats = (routeCommitsUserStats || []).filter(
        ({ contributor }) => contributor.user?.id !== authUser.id
      );

      // combine updates of users that both favorited/committed changes to a route
      const usersWithFavoritesAndCommits: {
        favorite: Favorite;
        contributions: ContributionCount;
      }[] = (routeFavoritesUserStats || [])
        .filter((favorite) => {
          return (restRouteCommitsUserStats || []).some(
            ({ contributor }) =>
              favorite.user?.id && contributor?.user?.id === favorite.user.id
          );
        })
        .map((favorite) => {
          const contributions =
            (restRouteCommitsUserStats || []).find(
              ({ contributor }) => contributor?.user?.id === favorite.user?.id
            ) || ({} as ContributionCount);

          return {
            favorite,
            contributions,
          };
        })
        .filter(({ favorite }) => favorite?.user?.id);

      await Promise.all([
        /**
         * decrement stats_favorites and stats_commits for all users
         * that favorited/contributed to the route
         */
        ...usersWithFavoritesAndCommits.map(
          ({ favorite: { user }, contributions: { contributor, count } }) =>
            user?.id
              ? xata.db.users.update(user.id, {
                  stats_favorites: (Number(user?.stats_favorites) || 1) - 1,
                  stats_commits:
                    (Number(contributor.user?.stats_commits) ||
                      Math.max(count, 1)) - Math.max(count, 1),
                })
              : false
        ),
        // decrement stats_favorites for all users that favorited the route
        ...(routeFavoritesUserStats || [])
          // filter out users that are already being updated in combination with commits
          .filter(
            ({ user }) =>
              !usersWithFavoritesAndCommits.some(
                ({ favorite }) => user?.id && favorite.user?.id === user.id
              )
          )
          .map(({ user }) =>
            user?.id
              ? xata.db.users.update(user.id, {
                  stats_favorites: (Number(user?.stats_favorites) || 1) - 1,
                })
              : false
          ),
        /**
         * decrement stats_commits of users
         * that contributed to the route (not including auth user)
         */
        ...(restRouteCommitsUserStats || [])
          // filter out users that are already being updated in combination with favorites
          .filter(
            ({ contributor }) =>
              !usersWithFavoritesAndCommits.some(
                ({ contributions }) =>
                  contributor.user?.id &&
                  contributions.contributor.user?.id === contributor.user.id
              )
          )
          .map(({ contributor, count }) =>
            contributor.user?.id
              ? xata.db.users.update(contributor.user.id, {
                  stats_commits:
                    (Number(contributor.user?.stats_commits) ||
                      Math.max(count, 1)) - Math.max(count, 1),
                })
              : false
          )
          .filter((updateFn) => updateFn),
        // decrement auth user stats_routes and stats_commits
        xata.db.users.update(authUser.id, {
          stats_routes: (Number(authUser.stats_routes) || 1) - 1,
          stats_commits:
            (Number(authUser.stats_commits) || 0) -
            (Number(
              authUserRouteCommitsUserStats.contributor.user?.stats_commits
            ) || Math.max(authUserRouteCommitsUserStats.count, 1)),
        }),
      ]);
    }

    // find and delete any previous feature images
    const prevFeatureImagePromises = (route_commit_items || [])
      .filter(({ action, payload }) => {
        if (
          [
            routeFeatureActions.update_feature_image,
            routeFeatureActions.remove_feature_image,
          ].includes(action as RouteFeatureActions)
        ) {
          const { prev } = payload ? JSON.parse(payload) : { prev: null };

          return prev?.id && !!prev.image_id;
        }
        return false;
      })
      .map(({ payload }) => {
        const { prev } = payload ? JSON.parse(payload) : { prev: null };

        if (prev?.id && prev.image_id) {
          return;
        }
      });

    // find and delete current feature images
    const currFeatureImagePromises = (route_features || [])
      .filter(({ id, image_id }) => id && image_id)
      .map(({ id, image_id }) => deleteFeatureImage(id, image_id));

    if (prevFeatureImagePromises.length || currFeatureImagePromises.length) {
      await Promise.all([
        // delete previous feature images
        ...prevFeatureImagePromises,
        // delete current feature images
        ...currFeatureImagePromises,
      ]);
    }

    // find any previous route images
    const prevRouteImageIds = (route_commit_items || [])
      .filter(({ action }) =>
        [
          routeActions.update_route_image,
          routeActions.remove_route_image,
        ].includes(action as RouteActions)
      )
      .map(({ payload }) => {
        const { prev } = payload ? JSON.parse(payload) : { prev: null };

        if (prev.image_id) {
          return prev.image_id;
        }
      });

    if (prevRouteImageIds.length || route.image_id) {
      // delete all route images (previous and current)
      await deleteRouteImages(route.id, [
        ...prevRouteImageIds,
        ...(route.image_id ? [route.image_id] : []),
      ]);
    }

    const rowsToDelete: {
      delete: { table: DatabaseSchemaKey; id: string };
    }[] = flatten([
      (route_favorites || []).map(({ id }) => ({
        delete: { table: databaseSchema.route_favorites, id },
      })),
      (route_contributors || []).map(({ id }) => ({
        delete: { table: databaseSchema.route_contributors, id },
      })),
      (route_members || []).map(({ id }) => ({
        delete: { table: databaseSchema.route_members, id },
      })),
      (route_commit_items || []).map(({ id }) => ({
        delete: { table: databaseSchema.route_commit_items, id },
      })),
      (route_commits || []).map(({ id }) => ({
        delete: { table: databaseSchema.route_commits, id },
      })),
      (route_features || []).map(({ id }) => ({
        delete: { table: databaseSchema.route_features, id },
      })),
      (route_layers || []).map(({ id }) => ({
        delete: { table: databaseSchema.route_layers, id },
      })),
      { delete: { table: databaseSchema.routes, id: route.id } },
    ]);

    await xata.transactions.run(rowsToDelete);

    if (route.fork_id) {
      // delete fork_route activity records
      deleteActivityRecords(authUser.id, {
        action: ActivityActions.FORK_ROUTE,
        resource_id: route.id,
        resource_table: databaseSchema.routes,
      });
    } else {
      // delete add_route activity records
      deleteActivityRecords(authUser.id, {
        action: ActivityActions.ADD_ROUTE,
        resource_id: route.id,
        resource_table: databaseSchema.routes,
      });
    }

    if (Array.isArray(route_commits) && route_commits.length > 1) {
      // delete update_route activity records
      deleteActivityRecords(authUser.id, {
        action: ActivityActions.UPDATE_ROUTE,
        resource_id: route.id,
        resource_table: databaseSchema.routes,
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new StatusError(
        400,
        `Something went wrong attempting to delete the route`
      );
    }
  }
};
