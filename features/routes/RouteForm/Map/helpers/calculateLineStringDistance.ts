import distance from '@turf/distance';
import * as turf from '@turf/helpers';

import { GeometryTypeNames } from '@/data/routes';
import { MapFeature } from '@/types/maps';
import { round } from '@/utils';

export const calculateLineStringDistance = (feature: MapFeature): number => {
  if (feature.geometry.type !== GeometryTypeNames.LineString) {
    return 0;
  }

  const lineString = turf.lineString(feature.geometry.coordinates);

  const { coordinates } = lineString.geometry;

  const distances = [];

  for (let i = 1; i < coordinates.length; i++) {
    const from = coordinates[i - 1];
    const to = coordinates[i];

    distances.push(distance(from, to, { units: 'kilometers' }));
  }

  const sum = distances.reduce((sum, num) => sum + num);

  return round(sum, 3);
};
