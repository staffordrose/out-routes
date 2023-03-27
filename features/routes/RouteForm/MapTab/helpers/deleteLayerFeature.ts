import { UseFieldArrayUpdate } from 'react-hook-form';

import { MapFeature } from '@/types/maps';
import { LayerValues, RouteFormValues } from '../../helpers';

export const deleteLayerFeature = (
  update: UseFieldArrayUpdate<RouteFormValues, 'layers'>,
  layerIndex: number,
  layer: LayerValues,
  feature: MapFeature
) => {
  const featureIndex = (layer.features || []).findIndex(
    (f) => feature.id === f.databaseId
  );
  if (featureIndex === -1) return;

  const nextLayer = structuredClone(layer);

  nextLayer.features = [
    ...(nextLayer.features || []).slice(0, featureIndex),
    ...(nextLayer.features || []).slice(featureIndex + 1),
  ];

  update(layerIndex, nextLayer);
};
