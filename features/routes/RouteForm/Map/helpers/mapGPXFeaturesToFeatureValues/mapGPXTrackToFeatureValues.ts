import { Map } from 'mapbox-gl';
import { Position } from 'geojson';

import { GeometryTypeNames } from '@/data/routes';
import { GPXTrack, LngLat, MapFeature } from '@/types/maps';
import { createAlphaNumericId, roundToDecimalCount } from '@/utils';
import {
  FeatureValues,
  mapMapboxFeatureToFeatureValues,
} from '../../../helpers';
import { calculateLineStringDistance, truncateGeometryCoordinates } from '..';

export const mapGPXTrackToFeatureValues = (
  mapRef: Map,
  layerId: MapFeature['properties']['layer'],
  featureIndex: number,
  trk: GPXTrack
): FeatureValues => {
  const coordinates = trk.points.map(({ lat, lon, ele }) => {
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
      title: trk.name || '',
      distance:
        typeof trk.distance.total === 'number'
          ? roundToDecimalCount(trk.distance.total / 1000, { decimalCount: 3 })
          : undefined,
      description: trk.desc || trk.cmt || '',
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
