import { LngLatBoundsLike } from 'mapbox-gl';
import safeJsonStringify from 'safe-json-stringify';

import { PaginatedRoutes } from '@/types/routes';
import { StatusError } from '@/utils';
import { getXataClient } from '@/xata';

export const getExploreRoutes = async (
  boundsStr: string | null,
  options?: {
    size: string | number;
    after?: string;
  }
): Promise<PaginatedRoutes> => {
  try {
    const bounds: LngLatBoundsLike = JSON.parse(boundsStr || '');

    // bounds are missing
    if (!Array.isArray(bounds) || !bounds.length) {
      throw new StatusError(400, `Map bounds are required to get map routes`);
    }

    const [sw, ne] = bounds as unknown as number[][];

    const xata = getXataClient();

    const routes = await xata.db.routes
      .filter({
        is_private: false,
        $all: [
          {
            map_start_lng: { $lt: ne[0] },
          },
          {
            map_start_lng: { $gt: sw[0] },
          },
          {
            map_start_lat: { $lt: ne[1] },
          },
          {
            map_start_lat: { $gt: sw[1] },
          },
        ],
      })
      .select(['*', 'owner.username'])
      .sort('updated_at', 'desc')
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
      throw new StatusError(400, `Something went wrong getting the map routes`);
    }
  }
};
