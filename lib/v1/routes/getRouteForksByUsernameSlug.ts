import safeJsonStringify from 'safe-json-stringify';

import { PaginatedRoutes, Route } from '@/types/routes';
import { User } from '@/types/users';
import { StatusError } from '@/utils';
import { getXataClient } from '@/xata';

export const getRouteForksByUsernameSlug = async (
  username: User['username'],
  slug: Route['slug'],
  options?: { size: string | number; after?: string }
): Promise<PaginatedRoutes> => {
  try {
    // username is missing
    if (!username) {
      throw new StatusError(
        400,
        `A valid username is required to get the route forks`
      );
    }

    // slug is missing
    if (!slug) {
      throw new StatusError(
        400,
        `A route slug is required to get the route forks`
      );
    }

    const xata = getXataClient();

    const route = await xata.db.routes
      .filter({ 'owner.username': username, slug })
      .select(['id'])
      .getFirst();

    if (!route) {
      throw new StatusError(
        404,
        `A route does not exist for the provided username and slug`
      );
    }

    const forks = await xata.db.routes
      .filter('fork_id', route.id)
      .select(['*'])
      .getPaginated({
        pagination: {
          size: Number(options?.size) || undefined,
          after: options?.after || undefined,
        },
      });

    return JSON.parse(safeJsonStringify(forks));
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new StatusError(
        400,
        `Something went wrong getting ${
          username && slug ? `${username}/${slug} forks` : `the route forks`
        }`
      );
    }
  }
};
