import flatten from 'lodash.flatten';

import { GeometryTypeNames } from '@/data/routes';
import { LngLat, MapLayer } from '@/types/maps';

export const getAllCoordinatesFromMapLayers = (
  mapLayers: MapLayer[]
): LngLat[] => {
  const coordinates: LngLat[] = [];

  mapLayers.forEach((layer) => {
    (layer.data.features || []).forEach(({ geometry }) => {
      if (geometry.type === GeometryTypeNames.Polygon) {
        const flattened = flatten(geometry.coordinates);
        flattened.forEach(([lng, lat]) => {
          coordinates.push([lng, lat]);
        });
      } else if (geometry.type === GeometryTypeNames.LineString) {
        geometry.coordinates.forEach(([lng, lat]) => {
          coordinates.push([lng, lat]);
        });
      } else {
        const [lng, lat] = geometry.coordinates;
        coordinates.push([lng, lat]);
      }
    });
  });

  return coordinates;
};
