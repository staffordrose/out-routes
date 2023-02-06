import safeJsonStringify from 'safe-json-stringify';

import { PaginatedRoutes, User } from '@/types';
import { StatusError } from '@/utils';
import { getXataClient } from '@/xata';

export const getRoutesByUsername = async (
  authUserId: User['id'] | null,
  username: User['username'],
  options?: {
    size: string | number;
    after?: string;
  }
): Promise<PaginatedRoutes> => {
  try {
    // username is missing
    if (!username) {
      throw new StatusError(
        400,
        `A valid username is required to get the user's routes`
      );
    }

    const xata = getXataClient();

    const user = await xata.db.users
      .filter({ username })
      .select(['id'])
      .getFirst();

    // user does not exist
    if (!user) {
      throw new StatusError(
        404,
        `A user does not exist for the provided username`
      );
    }

    let routes;

    if (authUserId && authUserId === user.id) {
      // auth user is owner of routes, get all routes
      routes = await xata.db.routes
        .filter('owner.username', username)
        .select(['*', 'owner.*'])
        .sort('updated_at', 'desc')
        .getPaginated({
          pagination: {
            size: Number(options?.size) || undefined,
            after: options?.after || undefined,
          },
        });
    } else {
      // get only public routes
      routes = await xata.db.routes
        .filter({ 'owner.username': username, is_private: false })
        .select(['*', 'owner.*'])
        .sort('updated_at', 'desc')
        .getPaginated({
          pagination: {
            size: Number(options?.size) || undefined,
            after: options?.after || undefined,
          },
        });
    }

    return JSON.parse(safeJsonStringify(routes));
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new StatusError(
        400,
        `Something went wrong getting ${
          username ? `@${username}'s routes` : `the user's routes`
        }`
      );
    }
  }
};
