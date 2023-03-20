import {
  GeometryTypeNames,
  SymbolCodes,
  symbolCodes,
  SymbolLabels,
  symbolLabelsToCodes,
} from '@/data/routes';
import { getFeatureElevations } from '@/lib/v1/api/map';
import { GPXWaypoint, MapFeature } from '@/types/maps';
import { createAlphaNumericId, round } from '@/utils';
import {
  FeatureValues,
  mapMapboxFeatureToFeatureValues,
} from '../../../helpers';

export const mapGPXWaypointToFeatureValues = async (
  layerId: MapFeature['properties']['layer'],
  featureIndex: number,
  wpt: GPXWaypoint
): Promise<FeatureValues> => {
  try {
    const coordinates = [round(wpt.lon, 6), round(wpt.lat, 6)];

    if (
      typeof wpt.ele === 'number' &&
      !Number.isNaN(wpt.ele) &&
      wpt.ele !== 0
    ) {
      coordinates.push(round(wpt.ele, 3));
    }

    if (coordinates.length === 2) {
      // get elevation for waypoint
      const [ele] = await getFeatureElevations({
        type: GeometryTypeNames.Point,
        coordinates,
      });

      if (typeof ele === 'number' && !Number.isNaN(ele)) {
        coordinates.push(ele);
      } else {
        coordinates.push(0);
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
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error(
        'Something went wrong mapping GPX waypoint to map feature'
      );
    }
  }
};
