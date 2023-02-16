import queryString from 'query-string';
import { FeatureCollection } from 'geojson';

import { LngLat } from '@/types';
import { getJson, StatusError } from '@/utils';

const mapboxGlAccessToken = process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN;

const BASE_URL = 'https://api.mapbox.com/v4/mapbox.mapbox-terrain-v2/tilequery';
const OPTIONS = queryString.stringify({
  access_token: mapboxGlAccessToken,
  layers: 'contour',
  limit: 50,
});

export const getElevationByLngLat = async ([
  lng,
  lat,
]: LngLat): Promise<number> => {
  try {
    const res = await fetch(`${BASE_URL}/${lng},${lat}.json?${OPTIONS}`);
    const data: FeatureCollection = await getJson(res);

    if (!res.ok) {
      throw new StatusError(
        res.status,
        `Something went wrong attempting to get the elevation`
      );
    }

    let highestElevation = 0;

    if (Array.isArray(data?.features) && data.features.length) {
      const elevations = data.features.map((f) => f.properties?.ele);
      highestElevation = Math.max(...elevations);
    }

    return highestElevation;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new StatusError(
        400,
        `Something went wrong attempting to get the elevation`
      );
    }
  }
};
