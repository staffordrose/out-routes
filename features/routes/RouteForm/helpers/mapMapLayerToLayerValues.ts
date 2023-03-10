import { ColorCodes } from '@/data/general';
import { SymbolCodes } from '@/data/routes';
import { MapLayer } from '@/types/maps';
import { LayerValues } from './types';
import { mapMapFeatureToFeatureValues } from './mapMapFeatureToFeatureValues';

export const mapMapLayerToLayerValues = (layer: MapLayer): LayerValues => {
  return {
    databaseId: layer.id,
    title: layer.title || '',
    color: layer.color || ColorCodes.Red,
    symbol: layer.symbol || SymbolCodes.Marker,
    features:
      Array.isArray(layer.data.features) && layer.data.features.length
        ? layer.data.features
            .slice()
            .sort((a, b) => a.properties.order - b.properties.order)
            .map((feature) => mapMapFeatureToFeatureValues(feature))
        : [],
  };
};
