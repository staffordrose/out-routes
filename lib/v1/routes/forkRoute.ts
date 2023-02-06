import safeJsonStringify from 'safe-json-stringify';

import { ActivityActions } from '@/data/activity';
import { commitActions, memberRoles, memberStatuses } from '@/data/routes';
import { Route, RouteFeature, User } from '@/types';
import { cloneRouteSlug, StatusError } from '@/utils';
import { getXataClient } from '@/xata';
import { addActivityRecords } from '../activity';
import { cloneFeatureImage, cloneRouteImage } from '../uploads';
import { getRouteByUsernameSlug } from './getRouteByUsernameSlug';

export const forkRoute = async (
  authUser: Pick<User, 'id'> & Partial<User>,
  username: User['username'],
  slug: Route['slug']
): Promise<Route> => {
  try {
    // username is missing
    if (!username) {
      throw new StatusError(
        400,
        `A valid username is required to fork a route`
      );
    }

    // slug is missing
    if (!slug) {
      throw new StatusError(400, `A route slug is required to fork a route`);
    }

    // route, layers, and features to be forked
    const base = await getRouteByUsernameSlug(username, slug);

    // route does not exist
    if (!base.route) {
      throw new StatusError(404, `The route you want to fork does not exist`);
    }

    const xata = getXataClient();

    const existingAuthRoute = await xata.db.routes
      .filter({ 'owner.id': authUser.id, slug })
      .select(['id'])
      .getFirst();

    // add characters to the end of slugs that match an existing slug
    const nextSlug = cloneRouteSlug(slug, !!existingAuthRoute?.id);

    const { title, title_alt, activity_type, region, country } = base.route;

    // fork the route
    const route = await xata.db.routes.create({
      created_at: new Date(),
      updated_at: new Date(),
      fork_id: base.route.id,
      fork_commit_id: base.route.commit_id,
      owner: authUser.id,
      is_private: false,
      slug: nextSlug,
      title,
      title_alt,
      activity_type,
      region,
      country,
      stats_layers: Number(base.route.stats_layers) || 0,
      stats_features: Number(base.route.stats_features) || 0,
      stats_members: 1,
      stats_contributors: 1,
      stats_commits: 1,
    });

    if (!route) {
      throw new StatusError(
        400,
        `An unknown error occurred while attempting to add the route`
      );
    }

    // clone image from base route
    if (base.route.image_id) {
      await cloneRouteImage(base.route.id, route.id);
    }

    // copy route layers and features
    if (Array.isArray(base.layers) && base.layers.length) {
      const layerPromises = base.layers.map(
        async ({ id, order, title, color, symbol }) => {
          // create layer using new route id
          const route_layer = await xata.db.route_layers.create({
            created_at: new Date(),
            updated_at: new Date(),
            route: route.id,
            order,
            title,
            color,
            symbol,
          });

          if (!route_layer) {
            return;
          }

          if (
            Array.isArray(base.features) &&
            base.features.some(({ layer }) => layer?.id === id)
          ) {
            const layerFeatures = base.features.filter(
              ({ layer }) => layer?.id === id
            ) as RouteFeature[];

            // create features using new route + layer ids
            const featurePromises = layerFeatures.map(
              async ({
                id,
                order,
                type,
                coordinates,
                title,
                color,
                symbol,
                description,
                ele_start,
                ele_end,
                distance,
                area,
                image_id,
              }) => {
                const route_feature = await xata.db.route_features.create({
                  created_at: new Date(),
                  updated_at: new Date(),
                  route: route.id,
                  layer: route_layer.id,
                  order,
                  type,
                  coordinates,
                  title,
                  color,
                  symbol,
                  description,
                  ele_start,
                  ele_end,
                  distance,
                  area,
                });

                if (!route_feature) {
                  return;
                }

                if (image_id) {
                  await cloneFeatureImage(id, route_feature.id);
                }
              }
            );

            return await Promise.all(featurePromises);
          }
        }
      );

      await Promise.all(layerPromises);
    }

    const [route_commit] = await Promise.all([
      // add first route commit
      xata.db.route_commits.create({
        created_at: new Date(),
        parent_id: base.route.commit_id,
        route: route.id,
        user: authUser.id,
        title: `Forked route from @${username}/${slug}`,
      }),
      // add user as route contributor
      xata.db.route_contributors.create({
        created_at: new Date(),
        contributed_at: new Date(),
        route: route.id,
        user: authUser.id,
        stats_contributions: 1,
      }),
      // add user as route member
      xata.db.route_members.create({
        created_at: new Date(),
        route: route.id,
        user: authUser.id,
        role: memberRoles.admin,
        status: memberStatuses.active,
      }),
      // update auth user stats
      xata.db.users.update(authUser.id, {
        stats_commits: (Number(authUser.stats_commits) || 0) + 1,
      }),
      // update base route 'forks' stats
      xata.db.routes.update(base.route.id, {
        stats_forks: (Number(base.route.stats_forks) || 0) + 1,
      }),
    ]);

    // link commit to route
    await xata.db.routes.update(route.id, {
      commit_id: route_commit.id,
    });

    if (route_commit?.id) {
      // add commit item
      await xata.db.route_commit_items.create({
        created_at: new Date(),
        commit: route_commit.id,
        action: commitActions.fork_route,
        payload: safeJsonStringify({
          route: base.route,
          layers: base.layers,
          features: base.features,
        }),
        resource_id: route.id,
        resource_table: 'routes',
      });
    }

    const routeWithOwner = await xata.db.routes
      .filter('id', route.id)
      .select(['*', 'owner.username'])
      .getFirst();

    // create activity records
    addActivityRecords(authUser.id, {
      action: ActivityActions.FORK_ROUTE,
      payload: routeWithOwner as Route,
    });

    return JSON.parse(safeJsonStringify(route));
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new StatusError(
        400,
        `Something went wrong attempting to fork the route`
      );
    }
  }
};
