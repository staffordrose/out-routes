import queryString from 'query-string';

import { GeocodingResponse } from '@/types/maps';
import { getJson, StatusError } from '@/utils';

const fallbackError = `Something went wrong with your search`;

export const geocodeQuery = async (q: string): Promise<GeocodingResponse> => {
  try {
    const res = await fetch(
      `/api/v1/map/geocode?${queryString.stringify({ q })}`
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
