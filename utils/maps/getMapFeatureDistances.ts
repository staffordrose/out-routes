import distance from '@turf/distance';
import * as turf from '@turf/helpers';

import { MapFeature } from '@/types/maps';
import { GeometryTypeNames } from '@/data/routes';

type FeatureDistances = {
  totalDistance: number;
  distances: number[];
};

export const getMapFeatureDistances = (
  feature: MapFeature
): FeatureDistances => {
  let totalDistance: FeatureDistances['totalDistance'] = 0;
  const distances: FeatureDistances['distances'] = [];

  if (feature.geometry.type === GeometryTypeNames.LineString) {
    const {
      geometry: { coordinates },
    } = feature;

    coordinates.forEach((position, index) => {
      if (index === 0) return;

      const from = turf.point(coordinates[index - 1]);
      const to = turf.point(position);
      const coordsDistance = distance(from, to, { units: 'kilometers' });

      totalDistance += coordsDistance;
      distances.push(coordsDistance);
    });
  }

  return { totalDistance, distances };
};
