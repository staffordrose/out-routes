import safeJsonStringify from 'safe-json-stringify';

import { PaginatedRoutes } from '@/types/routes';
import { StatusError } from '@/utils';
import { getXataClient } from '@/xata';

export const getRoutes = async (options?: {
  size: string | number;
  after?: string;
}): Promise<PaginatedRoutes> => {
  try {
    const xata = getXataClient();

    const routes = await xata.db.routes
      .filter('is_private', false)
      .select(['*', 'owner.*'])
      .sort('created_at', 'desc')
      .getPaginated({
        pagination: {
          size: Number(options?.size) || undefined,
          after: options?.after || undefined,
        },
      });

    return JSON.parse(safeJsonStringify(routes));
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new StatusError(400, `Something went wrong getting the routes`);
    }
  }
};
