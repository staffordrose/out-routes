import queryString from 'query-string';

import { LngLat } from '@/types/maps';
import { getJson, StatusError } from '@/utils';

const fallbackError = `Something went wrong attempting to get the elevation`;

export const getElevationByLngLat = async ([
  lng,
  lat,
]: LngLat): Promise<number> => {
  try {
    const res = await fetch(
      `/api/v1/map/elevation?${queryString.stringify({ lng, lat })}`
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
