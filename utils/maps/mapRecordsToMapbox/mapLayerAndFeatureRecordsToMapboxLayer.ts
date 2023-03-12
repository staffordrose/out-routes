import { ColorCodes } from '@/data/general';
import { SymbolCodes } from '@/data/routes';
import { MapLayer } from '@/types/maps';
import { RouteFeature, RouteLayer } from '@/types/routes';
import { FeatureCollection } from 'geojson';
import { mapFeatureRecordToMapboxFeature } from './mapFeatureRecordToMapboxFeature';

export const mapLayerAndFeatureRecordsToMapboxLayer = (
  layer: RouteLayer,
  features: RouteFeature[]
): MapLayer => {
  const geojson = {
    type: 'FeatureCollection' as FeatureCollection['type'],
    features: features.map((feature) =>
      mapFeatureRecordToMapboxFeature(layer, feature)
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
