import safeJsonStringify from 'safe-json-stringify';

import { PaginatedFavorites, User } from '@/types';
import { StatusError } from '@/utils';
import { getXataClient } from '@/xata';

export const getFavoritesByUsername = async (
  username: User['username'],
  options?: {
    size: string | number;
    after?: string;
  }
): Promise<PaginatedFavorites> => {
  try {
    // username is missing
    if (!username) {
      throw new StatusError(
        400,
        `A valid username is required to get the user's starred routes`
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

    // return only public routes
    const favorites = await xata.db.route_favorites
      .filter({ 'user.id': user.id, 'route.is_private': false })
      .select(['created_at', 'route.*', 'route.owner.username'])
      .sort('created_at', 'desc')
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
        `Something went wrong getting ${
          username
            ? `@${username}'s starred routes`
            : `the user's starred routes`
        }`
      );
    }
  }
};
