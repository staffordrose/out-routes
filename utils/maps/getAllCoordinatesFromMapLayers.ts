import { Position } from 'geojson';
import flatten from 'lodash.flatten';

import { GeometryTypeNames } from '@/data/routes';
import { MapLayer } from '@/types/maps';

export const getAllCoordinatesFromMapLayers = (
  mapLayers: MapLayer[]
): Position[] => {
  const coordinates: Position[] = [];

  const pushPosition = ([lng, lat, ele]: Position) => {
    const position = [lng, lat];

    if (ele) {
      position.push(ele);
    }

    coordinates.push(position);
  };

  mapLayers.forEach((layer) => {
    (layer.data.features || []).forEach(({ geometry }) => {
      if (geometry.type === GeometryTypeNames.Polygon) {
        const flattened = flatten(geometry.coordinates);
        flattened.forEach(([lng, lat, ele]) => {
          pushPosition([lng, lat, ele]);
        });
      } else if (geometry.type === GeometryTypeNames.LineString) {
        geometry.coordinates.forEach(([lng, lat, ele]) => {
          pushPosition([lng, lat, ele]);
        });
      } else {
        const [lng, lat, ele] = geometry.coordinates;

        pushPosition([lng, lat, ele]);
      }
    });
  });

  return coordinates;
};
