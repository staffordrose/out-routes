import safeJsonStringify from 'safe-json-stringify';

import { PaginatedFavorites } from '@/types/favorites';
import { Route } from '@/types/routes';
import { User } from '@/types/users';
import { StatusError } from '@/utils';
import { getXataClient } from '@/xata';

export const getRouteFavoritesByUsernameSlug = async (
  username: User['username'],
  slug: Route['slug'],
  options?: { size: string | number; after?: string }
): Promise<PaginatedFavorites> => {
  try {
    // username is missing
    if (!username) {
      throw new StatusError(
        400,
        `A valid username is required to get the users who starred the route`
      );
    }

    // slug is missing
    if (!slug) {
      throw new StatusError(
        400,
        `A route slug is required to get the users who starred the route`
      );
    }

    const xata = getXataClient();

    const favorites = await xata.db.route_favorites
      .filter({ 'route.owner.username': username, 'route.slug': slug })
      .select(['created_at', 'user.*'])
      .getPaginated({
        pagination: {
          size: Number(options?.size) || undefined,
          after: options?.after || undefined,
        },
      });

    return JSON.parse(safeJsonStringify(favorites));
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new StatusError(
        400,
        `Something went wrong getting the users who starred ${
          username && slug ? `${username}/${slug}` : `the route`
        }`
      );
    }
  }
};
