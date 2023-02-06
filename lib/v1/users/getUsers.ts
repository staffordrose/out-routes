import safeJsonStringify from 'safe-json-stringify';

import { PaginatedUsers } from '@/types';
import { StatusError } from '@/utils';
import { getXataClient } from '@/xata';

export const getUsers = async (options?: {
  size: string | number;
  after?: string;
}): Promise<PaginatedUsers> => {
  try {
    const xata = getXataClient();

    const users = await xata.db.users
      .select(['*'])
      .sort('username', 'desc')
      .getPaginated({
        pagination: {
          size: Number(options?.size) || undefined,
          after: options?.after || undefined,
        },
      });

    return JSON.parse(safeJsonStringify(users));
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new StatusError(400, `Something went wrong getting the users`);
    }
  }
};
