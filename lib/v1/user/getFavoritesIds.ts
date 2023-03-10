import safeJsonStringify from 'safe-json-stringify';

import { Route } from '@/types/routes';
import { User } from '@/types/users';
import { StatusError } from '@/utils';
import { getXataClient } from '@/xata';

export const getFavoritesIds = async (
  authUserId: User['id']
): Promise<Route['id'][]> => {
  try {
    const xata = getXataClient();

    const favorites = await xata.db.route_favorites
      .filter('user.id', authUserId)
      .select(['route.id'])
      .getAll();

    return JSON.parse(
      safeJsonStringify(
        favorites.map(({ route }) => route?.id).filter((id) => id)
      )
    );
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new StatusError(
        400,
        `Something went wrong getting your starred routes`
      );
    }
  }
};
