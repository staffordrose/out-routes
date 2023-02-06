import { MapFeature } from '@/types';
import { UseFieldArrayUpdate } from 'react-hook-form';
import { mapMapFeatureToFeatureValues, RouteFormValues } from '../../helpers';

export const updateLayerFeature = (
  update: UseFieldArrayUpdate<RouteFormValues, 'layers'>,
  layers: RouteFormValues['layers'],
  activeLayerId: RouteFormValues['activeLayerId'],
  feature: MapFeature
): void => {
  const nextLayers = Array.from(layers);

  const layerIndex = nextLayers.findIndex(
    (layer) => activeLayerId === layer.databaseId
  );
  const nextLayer = nextLayers[layerIndex];
  if (!nextLayer || layerIndex === -1) return;

  const featureIndex = (nextLayer.features || []).findIndex(
    (f) => feature.id === f.databaseId
  );
  if (featureIndex === -1) return;

  nextLayer.features = [
    ...(nextLayer.features || []).slice(0, featureIndex),
    mapMapFeatureToFeatureValues(feature),
    ...(nextLayer.features || []).slice(featureIndex + 1),
  ];

  update(layerIndex, nextLayer);
};
