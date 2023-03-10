import { ColorCodes } from '@/data/general';
import { SymbolCodes } from '@/data/routes';
import { RouteFeature, RouteLayer } from '@/types/routes';
import { mapFeatureRecordToFeatureValues } from './mapFeatureRecordToFeatureValues';
import { LayerValues } from './types';

export const mapLayerFeaturesRecordsToLayerValues = (
  layer: RouteLayer,
  features: RouteFeature[]
): LayerValues => {
  return {
    databaseId: layer.id,
    title: layer.title || '',
    color: layer.color || ColorCodes.Red,
    symbol: layer.symbol || SymbolCodes.Marker,
    features: Array.isArray(features)
      ? features
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((feature) => mapFeatureRecordToFeatureValues(feature))
      : [],
  };
};
