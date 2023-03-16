import center from '@turf/center';
import centerOfMass from '@turf/center-of-mass';
import * as turf from '@turf/helpers';

import { GeometryTypeNames } from '@/data/routes';
import { LngLat, MapFeature } from '@/types/maps';
import { average, isEven, round } from '../arithmetic';

export const getFeatureCenter = (feature: MapFeature): LngLat => {
  let coordinates: LngLat = [0, 0];

  if (feature.geometry.type === GeometryTypeNames.Polygon) {
    const polygon = turf.polygon(feature.geometry.coordinates);
    const { geometry } = centerOfMass(polygon);

    // set polygon coordinates
    coordinates = [geometry.coordinates[0], geometry.coordinates[1]];
  } else if (feature.geometry.type === GeometryTypeNames.LineString) {
    const c = feature.geometry.coordinates;

    const length = c.length;

    if (isEven(length)) {
      const minC = c[Math.ceil(length / 2) - 1];
      const maxC = c[Math.ceil(length / 2)];

      // average [lng, lat] of 2 midpoints
      const avg = [average([minC[0], maxC[0]]), average([minC[1], maxC[1]])];

      // set linestring coordinates
      coordinates = [avg[0], avg[1]];
    } else {
      // [lng, lat] of midpoint
      const center = c[Math.ceil(length / 2) - 1];

      // set linestring coordinates
      coordinates = [center[0], center[1]];
    }
  } else if (feature.geometry.type === GeometryTypeNames.Point) {
    const point = turf.point(feature.geometry.coordinates);
    const { geometry } = center(point);

    // set point coordinates
    coordinates = [geometry.coordinates[0], geometry.coordinates[1]];
  }

  return [round(coordinates[0], 6), round(coordinates[1], 6)];
};
