import { Map } from 'mapbox-gl';
import { Position } from 'geojson';

import { GeometryTypeNames } from '@/data/routes';
import { GPXRoute, LngLat, MapFeature } from '@/types/maps';
import { createAlphaNumericId, roundToDecimalCount } from '@/utils';
import {
  FeatureValues,
  mapMapboxFeatureToFeatureValues,
} from '../../../helpers';
import { calculateLineStringDistance, truncateGeometryCoordinates } from '..';

export const mapGPXRouteToFeatureValues = (
  mapRef: Map,
  layerId: MapFeature['properties']['layer'],
  featureIndex: number,
  rte: GPXRoute
): FeatureValues => {
  const coordinates = rte.points.map(({ lat, lon, ele }) => {
    const position: Position = [lon, lat];

    if (typeof ele === 'number' && !Number.isNaN(ele)) {
      // TODO: ele should be meters, but could be feet
      position.push(
        roundToDecimalCount(ele, {
          decimalCount: 3,
        })
      );
    } else {
      // get elevation
      const ele = mapRef.queryTerrainElevation(position as LngLat, {
        exaggerated: false,
      });

      if (typeof ele === 'number' && !Number.isNaN(ele)) {
        position.push(
          roundToDecimalCount(ele, {
            decimalCount: 3,
          })
        );
      }
    }

    return position;
  });

  let mapFeature: MapFeature = {
    id: createAlphaNumericId(24),
    type: 'Feature',
    geometry: {
      type: GeometryTypeNames.LineString,
      coordinates,
    },
    properties: {
      layer: layerId,
      order: featureIndex,
      title: rte.name || '',
      distance:
        typeof rte.distance.total === 'number'
          ? roundToDecimalCount(rte.distance.total / 1000, { decimalCount: 3 })
          : undefined,
      description: rte.desc || rte.cmt || '',
    },
  };

  if (typeof mapFeature.properties.distance !== 'number') {
    mapFeature = {
      ...mapFeature,
      properties: {
        ...mapFeature.properties,
        distance: calculateLineStringDistance(mapFeature),
      },
    };
  }

  // truncate coordinates
  mapFeature = truncateGeometryCoordinates(mapFeature);

  return mapMapboxFeatureToFeatureValues(mapFeature);
};
