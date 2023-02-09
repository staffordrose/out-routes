import type { LngLatBounds } from 'mapbox-gl';

import { mapboxgl } from '@/lib/client';
import { BoundingBox } from '@/types';

export const mapBoundingBoxToLngLatBounds = (
  boundingBox: BoundingBox
): LngLatBounds => {
  return new mapboxgl.LngLatBounds(
    new mapboxgl.LngLat(boundingBox._ne.lng, boundingBox._ne.lat),
    new mapboxgl.LngLat(boundingBox._sw.lng, boundingBox._sw.lat)
  );
};
