import center from '@turf/center';
import * as turf from '@turf/helpers';
import { Position } from 'geojson';

import { GeometryTypeNames } from '@/data/routes';
import type { MapFeature, MapLayer } from '@/types';
import { roundToDecimalCount } from '../../arithmetic';

export const getMapEndLngLatEle = (
  mapLayers: MapLayer[]
): { lng?: number; lat?: number; ele?: number } => {
  const featureCb = (feature: MapFeature) =>
    feature.geometry.type === GeometryTypeNames.Point;

  const lastLayerWithPoint = Array.from(mapLayers || [])
    .reverse()
    .find(({ data }) => {
      return Array.from(data.features || [])
        .reverse()
        .find(featureCb);
    });

  if (!lastLayerWithPoint) {
    return { lng: undefined, lat: undefined, ele: undefined };
  }

  const lastPoint = Array.from(lastLayerWithPoint.data.features || [])
    .reverse()
    .find(featureCb);

  if (!lastPoint) {
    return { lng: undefined, lat: undefined, ele: undefined };
  }

  const point = turf.point(lastPoint.geometry.coordinates as Position);
  const { geometry } = center(point);

  return {
    lng: roundToDecimalCount(geometry.coordinates[0], { decimalCount: 5 }),
    lat: roundToDecimalCount(geometry.coordinates[1], { decimalCount: 5 }),
    ele: lastPoint.properties.ele_start,
  };
};
