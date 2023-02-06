import { ColorCodes } from '@/data/general';
import { SymbolCodes } from '@/data/routes';
import { MapLayer, RouteFeature, RouteLayer } from '@/types';
import { FeatureCollection } from 'geojson';
import { mapFeatureRecordToMapFeature } from './mapFeatureRecordToMapFeature';

export const mapLayerRecordToMapLayer = (
  layer: RouteLayer,
  features: RouteFeature[]
): MapLayer => {
  const geojson = {
    type: 'FeatureCollection' as FeatureCollection['type'],
    features: features.map((feature) =>
      mapFeatureRecordToMapFeature(layer, feature)
    ),
  };

  return {
    id: layer.id,
    order: layer.order,
    title: layer.title || null,
    color: layer.color || ColorCodes.Red,
    symbol: layer.symbol || SymbolCodes.Marker,
    data: geojson,
  };
};
