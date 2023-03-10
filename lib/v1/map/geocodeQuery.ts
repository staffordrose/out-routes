import queryString from 'query-string';
import safeJsonStringify from 'safe-json-stringify';

import { GeocodingResponse } from '@/types/maps';
import { getJson, StatusError } from '@/utils';

const mapboxGlAccessToken = process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN;

const ENDPOINT = 'mapbox.places'; // results cannot be permanently stored
const BASE_URL = `https://api.mapbox.com/geocoding/v5/${ENDPOINT}`;
const OPTIONS = queryString.stringify({
  access_token: mapboxGlAccessToken,
  autocomplete: true,
  language: 'en',
});

export const geocodeQuery = async (q: string): Promise<GeocodingResponse> => {
  try {
    // query is missing
    if (!q) {
      throw new StatusError(400, `A search query required`);
    }

    const res = await fetch(`${BASE_URL}/${q}.json?${OPTIONS}`);
    const data = await getJson(res);

    return JSON.parse(safeJsonStringify(data));
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new StatusError(400, `Something went wrong with your search`);
    }
  }
};
