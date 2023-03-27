import { UseFieldArrayUpdate } from 'react-hook-form';

import { MapFeature } from '@/types/maps';
import {
  mapMapboxFeatureToFeatureValues,
  RouteFormValues,
} from '../../helpers';

export const addLayerFeature = (
  update: UseFieldArrayUpdate<RouteFormValues, 'layers'>,
  layers: RouteFormValues['layers'],
  activeLayerId: RouteFormValues['activeLayerId'],
  feature: MapFeature
) => {
  const nextLayers = Array.from(layers);

  const layerIndex = nextLayers.findIndex(
    (layer) => activeLayerId === layer.databaseId
  );
  const nextLayer = nextLayers[layerIndex];
  if (!nextLayer || layerIndex === -1) return;

  nextLayer.features = (nextLayer.features || []).concat(
    mapMapboxFeatureToFeatureValues(feature)
  );

  update(layerIndex, nextLayer);
};
