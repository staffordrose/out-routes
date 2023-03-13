import { Map } from 'mapbox-gl';

import {
  GeometryTypeNames,
  SymbolCodes,
  symbolCodes,
  SymbolLabels,
  symbolLabelsToCodes,
} from '@/data/routes';
import { GPXWaypoint, LngLat, MapFeature } from '@/types/maps';
import { createAlphaNumericId, roundToDecimalCount } from '@/utils';
import {
  FeatureValues,
  mapMapboxFeatureToFeatureValues,
} from '../../../helpers';

export const mapGPXWaypointToFeatureValues = (
  mapRef: Map,
  layerId: MapFeature['properties']['layer'],
  featureIndex: number,
  wpt: GPXWaypoint
): FeatureValues => {
  const coordinates = [
    roundToDecimalCount(wpt.lon, {
      decimalCount: 6,
    }),
    roundToDecimalCount(wpt.lat, {
      decimalCount: 6,
    }),
  ];

  if (typeof wpt.ele === 'number' && !Number.isNaN(wpt.ele)) {
    // TODO: wpt.ele should be meters, but could be feet
    coordinates.push(
      roundToDecimalCount(wpt.ele, {
        decimalCount: 3,
      })
    );
  } else {
    // get elevation
    const ele = mapRef.queryTerrainElevation(coordinates as LngLat, {
      exaggerated: false,
    });

    if (typeof ele === 'number' && !Number.isNaN(ele)) {
      coordinates.push(
        roundToDecimalCount(ele, {
          decimalCount: 3,
        })
      );
    }
  }

  const mapFeature: MapFeature = {
    id: createAlphaNumericId(24),
    type: 'Feature',
    geometry: {
      type: GeometryTypeNames.Point,
      coordinates,
    },
    properties: {
      layer: layerId,
      order: featureIndex,
      title: wpt.name || '',
      symbol: wpt.sym
        ? symbolCodes[wpt.sym as SymbolCodes] ||
          symbolLabelsToCodes[wpt.sym as SymbolLabels] ||
          undefined
        : undefined,
      description: wpt.desc || wpt.cmt || '',
    },
  };

  return mapMapboxFeatureToFeatureValues(mapFeature);
};
