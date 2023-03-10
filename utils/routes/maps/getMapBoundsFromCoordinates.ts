import type { LngLatBoundsLike } from 'mapbox-gl';

import { mapboxgl } from '@/lib/client';
import { LngLat } from '@/types/maps';

export const getMapBoundsFromCoordinates = (
  coordinates: LngLat[]
): LngLatBoundsLike | null => {
  if (Array.isArray(coordinates) && coordinates.length) {
    // create bounds with both corners at the first coordinate.
    const bounds = new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]);

    // extend bounds to include all coordinates
    for (const coord of coordinates) {
      bounds.extend(coord);
    }

    return bounds.toArray() as LngLatBoundsLike;
  } else {
    return null;
  }
};
