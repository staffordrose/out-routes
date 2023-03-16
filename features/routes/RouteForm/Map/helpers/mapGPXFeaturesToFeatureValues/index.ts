import { GPXFeature, GPXFeatures, MapFeature } from '@/types/maps';
import { FeatureValues } from '../../../helpers';
import { mapGPXRouteToFeatureValues } from './mapGPXRouteToFeatureValues';
import { mapGPXTrackToFeatureValues } from './mapGPXTrackToFeatureValues';
import { mapGPXWaypointToFeatureValues } from './mapGPXWaypointToFeatureValues';

export const mapGPXFeaturesToFeatureValues = async (
  layerId: MapFeature['properties']['layer'],
  gpxFeatures: GPXFeature[]
): Promise<FeatureValues[]> => {
  try {
    const featuresPromiseArray = gpxFeatures.map(
      async ({ type, feature }, featureIndex) => {
        if (type === GPXFeatures.RTE) {
          return await mapGPXRouteToFeatureValues(
            layerId,
            featureIndex,
            feature
          );
        } else if (type === GPXFeatures.TRK) {
          return await mapGPXTrackToFeatureValues(
            layerId,
            featureIndex,
            feature
          );
        } else {
          return await mapGPXWaypointToFeatureValues(
            layerId,
            featureIndex,
            feature
          );
        }
      }
    );

    return await Promise.all(featuresPromiseArray);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('An unknown error occured while importing GPX file');
    }
  }
};
