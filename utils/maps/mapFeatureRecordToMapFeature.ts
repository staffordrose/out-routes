import { geometryTypeNames, GeometryTypes } from '@/data/routes';
import { MapFeature } from '@/types/maps';
import { RouteFeature, RouteLayer } from '@/types/routes';
import { isJsonString } from '../data-structures';

export const mapFeatureRecordToMapFeature = (
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
      layerColor: layer.color || undefined,
      layerSymbol: layer.symbol || undefined,
      order: feature.order,
      title: feature.title || undefined,
      color: feature.color || undefined,
      symbol: feature.symbol || undefined,
      description: feature.description || undefined,
      ele_start: feature.ele_start || undefined,
      ele_end: feature.ele_end || undefined,
      distance: feature.distance || undefined,
      area: feature.area || undefined,
    },
  };
};
