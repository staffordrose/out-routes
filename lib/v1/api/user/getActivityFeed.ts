import queryString from 'query-string';

import { PaginatedActivity } from '@/types';
import { getJson, StatusError } from '@/utils';

const fallbackError = `Something went wrong getting your activity feed`;

export const getActivityFeed = async (options?: {
  size: string | number;
  after?: string;
}): Promise<PaginatedActivity> => {
  try {
    const res = await fetch(
      `/api/v1/user/activity?${queryString.stringify({
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
