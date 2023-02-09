import type { LngLatBounds } from 'mapbox-gl';

import { mapboxgl } from '@/lib/client';

export const parseMapBounds = (str?: string | null): LngLatBounds | null => {
  const b = JSON.parse(str || '');

  if (b?._ne && b._sw) {
    return new mapboxgl.LngLatBounds(
      new mapboxgl.LngLat(b._ne.lng, b._ne.lat),
      new mapboxgl.LngLat(b._sw.lng, b._sw.lat)
    );
  } else {
    return null;
  }
};
