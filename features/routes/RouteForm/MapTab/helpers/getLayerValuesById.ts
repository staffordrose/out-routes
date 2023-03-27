import { RouteLayer } from '@/types/routes';
import { LayerValues, RouteFormValues } from '../../helpers';

export const getLayerValuesById = (
  layers: RouteFormValues['layers'],
  id: RouteLayer['id']
): LayerValues | void => {
  const layerIndex = layers.findIndex((layer) => id === layer.databaseId);
  const layer = layers[layerIndex];
  if (!layer || layerIndex === -1) return;

  return layer;
};
