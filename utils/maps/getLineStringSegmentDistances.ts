import distance from '@turf/distance';
import { Position } from 'geojson';

export const getLineStringSegmentDistances = (
  coordinates: Position[]
): number[] => {
  const distances = [];

  for (let i = 1; i < coordinates.length; i++) {
    const from = coordinates[i - 1];
    const to = coordinates[i];

    distances.push(distance(from, to, { units: 'kilometers' }));
  }

  return distances;
};
