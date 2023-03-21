import { colorCodes, ColorNames, StandardColorCodes } from '@/data/general';
import { MapLayer } from '@/types/maps';
import { LayerValues } from '../types';
import { mapFeatureValuesToMapboxFeature } from './mapFeatureValuesToMapboxFeature';

export const mapLayerValuesToMapboxLayer = (
  layerOrder: number,
  layer: LayerValues
): MapLayer => {
  const color = layer.color
    ? colorCodes[layer.color as ColorNames]
    : StandardColorCodes.Red;

  return {
    id: layer.databaseId as string,
    order: layerOrder,
    title: layer.title,
    color,
    symbol: layer.symbol,
    data: {
      type: 'FeatureCollection',
      features:
        layer.features?.map((feature, featureOrder) =>
          mapFeatureValuesToMapboxFeature(
            {
              id: layer.databaseId as string,
              color,
              symbol: layer.symbol,
            },
            featureOrder,
            feature
          )
        ) || [],
    },
  };
};
