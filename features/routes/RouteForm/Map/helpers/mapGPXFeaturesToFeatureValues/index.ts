import { Map } from 'mapbox-gl';

import { GPXFeature, GPXFeatures, MapFeature } from '@/types/maps';
import { FeatureValues } from '../../../helpers';
import { mapGPXRouteToFeatureValues } from './mapGPXRouteToFeatureValues';
import { mapGPXTrackToFeatureValues } from './mapGPXTrackToFeatureValues';
import { mapGPXWaypointToFeatureValues } from './mapGPXWaypointToFeatureValues';

export const mapGPXFeaturesToFeatureValues = (
  mapRef: Map,
  layerId: MapFeature['properties']['layer'],
  gpxFeatures: GPXFeature[]
): FeatureValues[] => {
  const features = gpxFeatures.map(({ type, feature }, featureIndex) => {
    if (type === GPXFeatures.RTE) {
      return mapGPXRouteToFeatureValues(mapRef, layerId, featureIndex, feature);
    } else if (type === GPXFeatures.TRK) {
      return mapGPXTrackToFeatureValues(mapRef, layerId, featureIndex, feature);
    } else {
      return mapGPXWaypointToFeatureValues(
        mapRef,
        layerId,
        featureIndex,
        feature
      );
    }
  });

  return features;
};
