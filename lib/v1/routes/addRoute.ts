import safeJsonStringify from 'safe-json-stringify';
import slugify from 'slugify';

import { memberRoles, memberStatuses } from '@/data/routes';
import { Route } from '@/types/routes';
import { User } from '@/types/users';
import {
  cloneRouteSlug,
  sanitizeAndEscape,
  StatusError,
  validateSlug,
} from '@/utils';
import { getXataClient } from '@/xata';

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

    // create route
    const route = await xata.db.routes.create({
      created_at: new Date(),
      owner: authUser.id,
      slug,
    });

    if (!route) {
      throw new StatusError(
        400,
        `An unknown error occurred while attempting to add the route`
      );
    }

    // add user as route member
    await xata.db.route_members.create({
      created_at: new Date(),
      route: route.id,
      user: authUser.id,
      role: memberRoles.admin,
      status: memberStatuses.active,
    });

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
