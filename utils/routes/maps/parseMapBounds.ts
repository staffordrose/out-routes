import type { LngLatBounds } from 'mapbox-gl';

import { mapboxgl } from '@/lib/client';
import { isJsonString } from '@/utils/data-structures';

export const parseMapBounds = (str?: string | null): LngLatBounds | null => {
  const b = isJsonString(str || '') ? JSON.parse(str || '') : {};

  if (typeof b?.[0]?.[0] === 'number') {
    const sw = new mapboxgl.LngLat(b[0][0], b[0][1]);
    const ne = new mapboxgl.LngLat(b[1][0], b[1][1]);
    return new mapboxgl.LngLatBounds(sw, ne);
  } else {
    return null;
  }
};
