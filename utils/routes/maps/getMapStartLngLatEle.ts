import center from '@turf/center';
import * as turf from '@turf/helpers';
import { Position } from 'geojson';

import { GeometryTypeNames } from '@/data/routes';
import { MapFeature, MapLayer } from '@/types/maps';
import { roundToDecimalCount } from '../../arithmetic';

export const getMapStartLngLatEle = (
  mapLayers: MapLayer[]
): { lng?: number; lat?: number; ele?: number } => {
  const featureCb = (feature: MapFeature) =>
    feature.geometry.type === GeometryTypeNames.Point;

  const firstLayerWithPoint = mapLayers.find(({ data }) => {
    return data.features?.find(featureCb);
  });

  if (!firstLayerWithPoint) {
    return { lng: undefined, lat: undefined, ele: undefined };
  }

  const firstPoint = firstLayerWithPoint.data.features?.find(featureCb);

  if (!firstPoint) {
    return { lng: undefined, lat: undefined, ele: undefined };
  }

  const point = turf.point(firstPoint.geometry.coordinates as Position);
  const { geometry } = center(point);

  return {
    lng: roundToDecimalCount(geometry.coordinates[0], { decimalCount: 5 }),
    lat: roundToDecimalCount(geometry.coordinates[1], { decimalCount: 5 }),
    ele: firstPoint.properties.ele_start,
  };
};
