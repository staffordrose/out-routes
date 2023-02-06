import { MapFeature, MapLayer } from '@/types';
import { UseFieldArrayUpdate } from 'react-hook-form';
import { RouteFormValues } from '../../helpers';

export const deleteLayerFeature = (
  update: UseFieldArrayUpdate<RouteFormValues, 'layers'>,
  layers: RouteFormValues['layers'],
  layerId: MapLayer['id'],
  feature: MapFeature
) => {
  const nextLayers = Array.from(layers);

  const layerIndex = nextLayers.findIndex(
    (layer) => layerId === layer.databaseId
  );
  const nextLayer = nextLayers[layerIndex];
  if (!nextLayer || layerIndex === -1) return;

  const featureIndex = (nextLayer.features || []).findIndex(
    (f) => feature.id === f.databaseId
  );
  if (featureIndex === -1) return;

  nextLayer.features = [
    ...(nextLayer.features || []).slice(0, featureIndex),
    ...(nextLayer.features || []).slice(featureIndex + 1),
  ];

  update(layerIndex, nextLayer);
};
