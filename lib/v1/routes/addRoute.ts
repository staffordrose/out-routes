import safeJsonStringify from 'safe-json-stringify';
import slugify from 'slugify';

import { ActivityActions } from '@/data/activity';
import { memberRoles, memberStatuses } from '@/data/routes';
import { Route, User } from '@/types';
import {
  cloneRouteSlug,
  compareCommits,
  sanitizeAndEscape,
  StatusError,
  validateSlug,
} from '@/utils';
import { getXataClient } from '@/xata';
import { addActivityRecords } from '../user';

export const addRoute = async (
  authUser: Pick<User, 'id'> & Partial<User>,
  values: Pick<Route, 'title'> & Partial<Route>
): Promise<Route> => {
  try {
    // title is missing
    if (!values.title) {
      throw new StatusError(400, `A title is required to create a new route`);
    }

    const title = sanitizeAndEscape(values.title || '');

    // create slug using slugify
    let slug = slugify(title).toLowerCase();

    // prevent slug from using reserved words
    validateSlug(slug);

    const xata = getXataClient();

    const existingAuthRoute = await xata.db.routes
      .filter({ 'owner.id': authUser.id, slug })
      .select(['id'])
      .getFirst();

    // add characters to the end of slugs that match an existing slug
    slug = cloneRouteSlug(slug, !!existingAuthRoute?.id);

    const {
      is_private,
      title_alt,
      activity_type,
      region,
      country,
      ele_start,
      ele_end,
      image_id,
      image_full,
      image_og,
      image_banner,
      image_card_banner,
      image_thumb_360,
      image_thumb_240,
      image_thumb_120,
    } = values;

    // create route
    const route = await xata.db.routes.create({
      created_at: new Date(),
      updated_at: new Date(),
      owner: authUser.id,
      is_private: Boolean(is_private),
      slug,
      title,
      title_alt: Array.isArray(title_alt)
        ? title_alt.map((t) => sanitizeAndEscape(t || ''))
        : [],
      activity_type,
      region: sanitizeAndEscape(region || ''),
      country,
      ele_start: Number(ele_start) || 0,
      ele_end: Number(ele_end) || 0,
      image_id,
      image_full,
      image_og,
      image_banner,
      image_card_banner,
      image_thumb_360,
      image_thumb_240,
      image_thumb_120,
      stats_layers: 0,
      stats_features: 0,
      stats_members: 1,
      stats_contributors: 1,
      stats_commits: 1,
      stats_forks: 0,
      stats_favorites: 0,
    });

    if (!route) {
      throw new StatusError(
        400,
        `An unknown error occurred while attempting to add the route`
      );
    }

    const [route_commit] = await Promise.all([
      // add first route commit
      xata.db.route_commits.create({
        created_at: new Date(),
        route: route.id,
        user: authUser.id,
        title: 'Route created',
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
        stats_routes: (Number(authUser.stats_routes) || 0) + 1,
        stats_commits: (Number(authUser.stats_commits) || 0) + 1,
      }),
    ]);

    // link commit to route
    await xata.db.routes.update(route.id, {
      commit_id: route_commit.id,
    });

    if (route && route_commit?.id) {
      // add commit items
      const commitItems = compareCommits({ route: undefined }, { route });

      const routeCommitItemPromises = commitItems.map(
        async ({ action, payload, resource_id, resource_table }) => {
          return await xata.db.route_commit_items.create({
            created_at: new Date(),
            commit: route_commit.id,
            action,
            payload: safeJsonStringify(payload),
            resource_id,
            resource_table,
          });
        }
      );
      await Promise.all(routeCommitItemPromises);
    }

    if (!is_private) {
      const routeWithOwner = await xata.db.routes
        .filter('id', route.id)
        .select(['*', 'owner.username'])
        .getFirst();

      // create activity records
      addActivityRecords(authUser.id, {
        action: ActivityActions.ADD_ROUTE,
        payload: routeWithOwner as Route,
      });
    }

    return JSON.parse(safeJsonStringify(route));
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new StatusError(
        400,
        `Something went wrong attempting to add the route`
      );
    }
  }
};
