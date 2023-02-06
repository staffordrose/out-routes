import safeJsonStringify from 'safe-json-stringify';

import { PaginatedActivity, User } from '@/types';
import { StatusError } from '@/utils';
import { getXataClient } from '@/xata';

export const getActivityFeed = async (
  authUserId: User['id'],
  options?: {
    size: string | number;
    after?: string;
  }
): Promise<PaginatedActivity> => {
  try {
    const xata = getXataClient();

    const activity = await xata.db.activity
      .filter('user.id', authUserId)
      .select(['*', 'user.*', 'creator.*'])
      .sort('created_at', 'desc')
      .getPaginated({
        pagination: {
          size: Number(options?.size) || undefined,
          after: options?.after || undefined,
        },
      });

    return JSON.parse(safeJsonStringify(activity));
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new StatusError(
        400,
        `Something went wrong getting your activiy feed`
      );
    }
  }
};
