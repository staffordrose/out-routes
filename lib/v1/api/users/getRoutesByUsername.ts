import queryString from 'query-string';

import { PaginatedRoutes } from '@/types/routes';
import { User } from '@/types/users';
import { getJson, StatusError } from '@/utils';

const fallbackError = `Something went wrong getting routes`;

export const getRoutesByUsername = async (
  username: User['username'],
  options?: { size: string | number; after?: string }
): Promise<PaginatedRoutes> => {
  try {
    const res = await fetch(
      `/api/v1/users/${username}/routes?${queryString.stringify({
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
