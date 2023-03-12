import { MapLayer } from '@/types/maps';
import { LayerValues } from '../types';
import { mapFeatureValuesToMapboxFeature } from './mapFeatureValuesToMapboxFeature';

export const mapLayerValuesToMapboxLayer = (
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
          mapFeatureValuesToMapboxFeature(
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
