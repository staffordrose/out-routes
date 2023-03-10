import { MapLayer } from '@/types/maps';
import { mapFeatureValuesToMapFeature } from './mapFeatureValuesToMapFeature';
import { LayerValues } from './types';

export const mapLayerValuesToMapLayer = (
  layerOrder: number,
  layer: LayerValues
): MapLayer => {
  return {
    id: layer.databaseId as string,
    order: layerOrder,
    title: layer.title,
    color: layer.color,
    symbol: layer.symbol,
    data: {
      type: 'FeatureCollection',
      features:
        layer.features?.map((feature, featureOrder) =>
          mapFeatureValuesToMapFeature(
            {
              id: layer.databaseId as string,
              color: layer.color,
              symbol: layer.symbol,
            },
            featureOrder,
            feature
          )
        ) || [],
    },
  };
};
