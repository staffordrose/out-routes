import { FeatureCollection } from 'geojson';
import queryString from 'query-string';

import { LngLat } from '@/types';

const mapboxGlAccessToken = process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN;

const BASE_URL = 'https://api.mapbox.com/v4/mapbox.mapbox-terrain-v2/tilequery';
const AUTHORIZATION = `access_token=${mapboxGlAccessToken}`;
const OPTIONS = queryString.stringify({
  layers: 'contour',
  limit: 50,
});

export const getLngLatElevation = async ([
  lng,
  lat,
]: LngLat): Promise<number> => {
  try {
    const res = await fetch(
      `${BASE_URL}/${lng},${lat}.json?${AUTHORIZATION}&${OPTIONS}`
    );
    const data: FeatureCollection = res.ok
      ? await res.json()
      : ({} as FeatureCollection);

    let highestElevation = 0;

    if (Array.isArray(data?.features) && data.features.length) {
      const elevations = data.features.map((f) => f.properties?.ele);
      highestElevation = Math.max(...elevations);
    }

    return highestElevation;
  } catch (error) {
    throw error;
  }
};
