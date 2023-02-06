import queryString from 'query-string';

import { PaginatedFavorites, User } from '@/types';
import { getJson, StatusError } from '@/utils';

const fallbackError = `Something went wrong getting starred routes`;

export const getFavoritesByUsername = async (
  username: User['username'],
  options?: { size: string | number; after?: string }
): Promise<PaginatedFavorites> => {
  try {
    const res = await fetch(
      `/api/v1/users/${username}/favorites?${queryString.stringify({
        size: options?.size,
        after: options?.after,
      })}`
    );
    const data = await getJson(res);

    if (!res.ok) {
      throw new StatusError(res.status, data?.message || fallbackError);
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new StatusError(400, fallbackError);
    }
  }
};
