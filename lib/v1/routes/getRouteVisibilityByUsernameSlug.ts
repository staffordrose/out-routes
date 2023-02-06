import safeJsonStringify from 'safe-json-stringify';

import { Route, User } from '@/types';
import { StatusError } from '@/utils';
import { getXataClient } from '@/xata';

export const getRouteVisibilityByUsernameSlug = async (
  username: User['username'],
  slug: Route['slug']
): Promise<Pick<Route, 'is_private'>> => {
  try {
    // username is missing
    if (!username) {
      throw new StatusError(
        400,
        `A valid username is required to get a route's visibility`
      );
    }

    // slug is missing
    if (!slug) {
      throw new StatusError(
        400,
        `A route slug is required to get a route's visibility`
      );
    }

    const xata = getXataClient();

    const route = await xata.db.routes
      .filter({ 'owner.username': username, slug })
      .select(['is_private'])
      .getFirst();

    // route does not exist
    if (!route) {
      throw new StatusError(
        404,
        `A route does not exist for the provided username and slug`
      );
    }

    // is_private property not set
    if (typeof route.is_private !== 'boolean') {
      throw new StatusError(400, `The route's visibility is not set`);
    }

    return JSON.parse(safeJsonStringify(route));
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new StatusError(
        400,
        `Something went wrong getting the route's visibility`
      );
    }
  }
};
