import { RouteFeature, RouteLayer } from '@/types/routes';
import { createAlphaNumericId } from '@/utils';
import { LayerValues, RouteFormValues } from '../types';
import { mapFeatureValuesToFeatureRecord } from './mapFeatureValuesToFeatureRecord';

export const mapLayerValuesToLayerAndFeatureRecords = (
  routeId: RouteFormValues['route']['id'],
  layerIndex: number,
  layerValues: LayerValues
): { layer: RouteLayer; features: RouteFeature[] } => {
  const layerId = layerValues.databaseId || createAlphaNumericId(24);

  const layer: RouteLayer = {
    id: layerId,
    route: { id: routeId } as RouteLayer['route'],
    order: layerIndex,
    title: layerValues.title,
    color: layerValues.color,
    symbol: layerValues.symbol,
  };

  const features: RouteFeature[] = [];

  if (Array.isArray(layerValues.features) && layerValues.features.length) {
    for (
      let featureIndex = 0;
      featureIndex < layerValues.features.length;
      featureIndex++
    ) {
      const feature = layerValues.features[featureIndex];

      features.push(
        mapFeatureValuesToFeatureRecord(routeId, layerId, featureIndex, feature)
      );
    }
  }

  return {
    layer,
    features,
  };
};
