import type { LngLatBoundsLike } from 'mapbox-gl';
import { Position } from 'geojson';

import { mapboxgl } from '@/lib/client';
import { LngLat } from '@/types/maps';

export const getMapBoundsFromCoordinates = (
  coordinates: Position[]
): LngLatBoundsLike | null => {
  if (Array.isArray(coordinates) && coordinates.length) {
    // create bounds with both corners at the first coordinate
    const bounds = new mapboxgl.LngLatBounds(
      coordinates[0] as LngLat,
      coordinates[0] as LngLat
    );

    if (coordinates.length > 1) {
      // extend bounds to include all coordinates
      for (const coord of coordinates) {
        bounds.extend(coord as LngLat);
      }

      return bounds.toArray() as LngLatBoundsLike;
    } else {
      // get bounds for single point
      const point = coordinates[0];

      const lngLat = new mapboxgl.LngLat(point[0], point[1]);

      // use 100 foot radius
      const bounds = lngLat.toBounds(100);

      return bounds.toArray() as LngLatBoundsLike;
    }
  } else {
    return null;
  }
};
