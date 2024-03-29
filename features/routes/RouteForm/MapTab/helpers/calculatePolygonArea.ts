import area from '@turf/area';
import * as turf from '@turf/helpers';

import { GeometryTypeNames } from '@/data/routes';
import { round } from '@/utils';
import { MapFeature } from '@/types/maps';

export const calculatePolygonArea = (feature: MapFeature): number => {
  if (feature.geometry.type !== GeometryTypeNames.Polygon) {
    return 0;
  }

  const polygon = turf.polygon(feature.geometry.coordinates);

  return round(area(polygon), 3);
};
