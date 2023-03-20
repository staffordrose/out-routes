import along from '@turf/along';
import * as turf from '@turf/helpers';
import { Position } from 'geojson';

import { LngLat, MapFeature } from '@/types/maps';
import { getMapFeatureDistances } from '@/utils';

type Feature = {
  coordinates: Position[];
  totalDistance: number;
  distances: number[];
};

export const getLngLatAtCursorPx = (
  containerWidth: number,
  cursorPx: number,
  mapFeatures: MapFeature[]
): LngLat | null => {
  if (
    !containerWidth ||
    typeof cursorPx !== 'number' ||
    Number.isNaN(cursorPx)
  ) {
    return null;
  }

  const { kmTotal, features } = mapFeatures.reduce(
    (accum, feature) => {
      const { totalDistance, distances } = getMapFeatureDistances(feature);

      accum.kmTotal += totalDistance;
      accum.features.push({
        coordinates: feature.geometry.coordinates as Position[],
        totalDistance,
        distances,
      });

      return accum;
    },
    { kmTotal: 0, features: [] } as {
      kmTotal: number;
      features: Feature[];
    }
  );

  let lngLat: LngLat | null = null;

  const kmProgress = (cursorPx / containerWidth) * kmTotal;

  let distancesSum = 0;

  featuresLoop: for (let i = 0; i < features.length; i++) {
    let featureDistancesSum = 0;

    for (let j = -1; j < features[i].distances.length; j++) {
      const feature = features[i];

      const distance = j === -1 ? 0 : feature.distances[j];
      const fromCoords = feature.coordinates[j];
      const toCoords = feature.coordinates[j + 1];

      const start = distancesSum + featureDistancesSum;

      if (kmProgress >= start && kmProgress < start + distance) {
        const progressFromStart = kmProgress - start;

        const lineString = turf.lineString([fromCoords, toCoords]);
        const feat = along(lineString, progressFromStart, {
          units: 'kilometers',
        });

        lngLat = [feat.geometry.coordinates[0], feat.geometry.coordinates[1]];

        // break out of both loops
        break featuresLoop;
      }

      featureDistancesSum += distance;
    }

    distancesSum += featureDistancesSum;
  }

  return lngLat;
};
