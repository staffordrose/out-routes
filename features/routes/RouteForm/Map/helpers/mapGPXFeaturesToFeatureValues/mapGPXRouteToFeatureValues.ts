import { GeometryTypeNames } from '@/data/routes';
import { getFeatureElevations } from '@/lib/v1/api/map';
import { GPXRoute, MapFeature } from '@/types/maps';
import { createAlphaNumericId, getMapFeatureDistances, round } from '@/utils';
import {
  FeatureValues,
  mapMapboxFeatureToFeatureValues,
} from '../../../helpers';
import { truncateGeometryCoordinates } from '..';

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
        distance: undefined,
        description: rte.desc || rte.cmt || '',
      },
    };

    const { totalDistance: distance } = getMapFeatureDistances(mapFeature);

    // add feature distance to properties
    mapFeature.properties.distance = distance;

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
