import { colorCodes, ColorNames, StandardColorCodes } from '@/data/general';
import { geometryTypeNames, GeometryTypes, SymbolCodes } from '@/data/routes';
import { MapFeature } from '@/types/maps';
import { RouteFeature, RouteLayer } from '@/types/routes';
import { isJsonString } from '../../data-structures';

export const mapFeatureRecordToMapboxFeature = (
  layer: RouteLayer,
  feature: RouteFeature
): MapFeature => {
  const type = geometryTypeNames[feature.type as GeometryTypes];

  const coordinates = isJsonString(feature.coordinates || '')
    ? JSON.parse(feature.coordinates || '')
    : feature.coordinates || [];

  return {
    id: feature.id,
    type: 'Feature',
    geometry: {
      type,
      coordinates,
    },
    properties: {
      layer: layer.id,
      layerColor: layer.color
        ? colorCodes[layer.color as ColorNames]
        : StandardColorCodes.Red,
      layerSymbol: layer.symbol || SymbolCodes.Marker,
      order: feature.order,
      title: feature.title || undefined,
      color: feature.color
        ? colorCodes[feature.color as ColorNames]
        : undefined,
      symbol: feature.symbol || undefined,
      description: feature.description || undefined,
      distance: feature.distance || undefined,
      area: feature.area || undefined,
    },
  };
};
