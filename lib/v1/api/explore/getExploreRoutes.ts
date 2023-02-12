import queryString from 'query-string';

import { PaginatedRoutes } from '@/types';
import { getJson, StatusError } from '@/utils';

const fallbackError = `Something went wrong getting map routes`;

export const getExploreRoutes = async (
  bounds: string,
  options?: { size: string | number; after?: string }
): Promise<PaginatedRoutes> => {
  try {
    const res = await fetch(
      `/api/v1/explore?${queryString.stringify({
        bounds,
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
