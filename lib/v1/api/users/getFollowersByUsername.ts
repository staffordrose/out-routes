import queryString from 'query-string';

import { PaginatedFollowers, User } from '@/types';
import { getJson, StatusError } from '@/utils';

const fallbackError = `Something went wrong getting followers`;

export const getFollowersByUsername = async (
  username: User['username'],
  options?: { size: string | number; after?: string }
): Promise<PaginatedFollowers> => {
  try {
    const res = await fetch(
      `/api/v1/users/${username}/followers?${queryString.stringify({
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
