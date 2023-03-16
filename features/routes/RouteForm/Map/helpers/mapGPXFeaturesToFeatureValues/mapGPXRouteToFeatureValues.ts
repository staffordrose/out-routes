import { GeometryTypeNames } from '@/data/routes';
import { getFeatureElevations } from '@/lib/v1/api/map';
import { GPXRoute, MapFeature } from '@/types/maps';
import { createAlphaNumericId, round } from '@/utils';
import {
  FeatureValues,
  mapMapboxFeatureToFeatureValues,
} from '../../../helpers';
import { calculateLineStringDistance, truncateGeometryCoordinates } from '..';

export const mapGPXRouteToFeatureValues = async (
  layerId: MapFeature['properties']['layer'],
  featureIndex: number,
  rte: GPXRoute
): Promise<FeatureValues> => {
  try {
    let coordinates = rte.points.map(({ lat, lon, ele }) => {
      const position = [round(lon, 6), round(lat, 6)];
      if (typeof ele === 'number' && !Number.isNaN(ele) && ele !== 0) {
        position.push(ele);
      }
      return position;
    });

    if (!coordinates.every((position) => position.length === 3)) {
      // get elevations for each routepoint
      const elevations = await getFeatureElevations({
        type: GeometryTypeNames.LineString,
        coordinates,
      });

      // add elevations to coordinates
      for (let i = 0; i < coordinates.length; i++) {
        const ele = elevations[i];
        if (typeof ele === 'number' && !Number.isNaN(ele)) {
          coordinates[i][2] = ele;
        } else {
          coordinates[i][2] = 0;
        }
      }
    }

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
            ? round(rte.distance.total / 1000, 3)
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
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('Something went wrong mapping GPX route to map feature');
    }
  }
};
