import type { LngLatBoundsLike } from 'mapbox-gl';
import flatten from 'lodash.flatten';

import { GeometryTypeNames } from '@/data/routes';
import { mapboxgl } from '@/lib/client';
import { LngLat, MapLayer } from '@/types';

export const getMapBoundsFromMapLayers = (
  mapLayers: MapLayer[]
): LngLatBoundsLike | null => {
  // combine all feature coordinates
  const coordinates: LngLat[] = getAllLngLatFromMapLayers(mapLayers);

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

const getAllLngLatFromMapLayers = (mapLayers: MapLayer[]): LngLat[] => {
  const positions: LngLat[] = [];

  mapLayers.forEach((layer) => {
    (layer.data.features || []).forEach(({ geometry }) => {
      if (geometry.type === GeometryTypeNames.Polygon) {
        const flattened = flatten(geometry.coordinates);
        flattened.forEach(([lng, lat]) => {
          positions.push([lng, lat]);
        });
      } else if (geometry.type === GeometryTypeNames.LineString) {
        geometry.coordinates.forEach(([lng, lat]) => {
          positions.push([lng, lat]);
        });
      } else {
        const [lng, lat] = geometry.coordinates;
        positions.push([lng, lat]);
      }
    });
  });

  return positions;
};
