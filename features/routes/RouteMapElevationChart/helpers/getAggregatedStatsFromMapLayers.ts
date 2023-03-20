import { Position } from 'geojson';
import flatten from 'lodash.flatten';

import { GeometryTypeNames } from '@/data/routes';
import { MapFeature, MapLayer } from '@/types/maps';
import { getMapFeatureDistances } from '@/utils';

export const getAggregatedStatsFromMapLayers = (mapLayers: MapLayer[]) => {
  const isLineStringCb = (feature: MapFeature) =>
    feature.geometry.type === GeometryTypeNames.LineString;

  return mapLayers.reduce(
    (accum, layer) => {
      if (
        Array.isArray(layer.data.features) &&
        layer.data.features.some(isLineStringCb)
      ) {
        const features = layer.data.features.filter(isLineStringCb);

        const kmTotal = features.reduce((accum, feature) => {
          const { totalDistance } = getMapFeatureDistances(feature);
          accum += totalDistance;
          return accum;
        }, 0);

        const allEle = flatten(
          features.map((feature) =>
            (feature.geometry.coordinates as Position[])
              .map((position) => position[2])
              .filter((ele) => typeof ele === 'number' && !Number.isNaN(ele))
          )
        );

        const eleMax = Math.max.apply(null, allEle);
        const eleMin = Math.min.apply(null, allEle);

        accum.features = accum.features.concat(features);
        accum.kmTotal += kmTotal;
        accum.eleMax = Math.max(eleMax, accum.eleMax);
        accum.eleMin =
          accum.eleMin !== null ? Math.min(eleMin, accum.eleMin) : eleMin;
      }

      return accum;
    },
    { features: [], kmTotal: 0, eleMax: 0, eleMin: null } as {
      features: MapFeature[];
      kmTotal: number;
      eleMax: number;
      eleMin: number | null;
    }
  );
};
