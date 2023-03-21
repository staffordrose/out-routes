import { colorCodes, ColorNames } from '@/data/general';
import {
  GeometryTypeNames,
  geometryTypeNames,
  GeometryTypes,
} from '@/data/routes';
import { MapFeature } from '@/types/maps';
import { RouteLayer } from '@/types/routes';
import { FeatureValues } from '../types';

// TODO: Add support for feature images
export const mapFeatureValuesToMapboxFeature = (
  layer: Pick<RouteLayer, 'id'> & Partial<RouteLayer>,
  featureOrder: number,
  feature: FeatureValues
): MapFeature => {
  const type = geometryTypeNames[feature.type as GeometryTypes];

  const coordinates =
    Array.isArray(feature.coordinates) && feature.coordinates.length
      ? feature.coordinates.map(({ lat, lng, ele }) => {
          const position = [Number(lng), Number(lat)];

          if (!Number.isNaN(Number(ele))) {
            position.push(Number(ele));
          }

          return position;
        })
      : [];

  return {
    id: feature.databaseId as string,
    type: 'Feature',
    geometry: {
      type,
      coordinates:
        type === GeometryTypeNames.Polygon
          ? [coordinates]
          : type === GeometryTypeNames.LineString
          ? coordinates
          : coordinates[0],
    } as MapFeature['geometry'],
    properties: {
      layer: layer.id,
      layerColor: layer.color || undefined,
      // Prepend layerSymbol with 'maki-' to support mapboxDrawStyles
      layerSymbol: layer.symbol ? `maki-${layer.symbol}` : undefined,
      order: featureOrder,
      title: feature.title || undefined,
      color: feature.color
        ? colorCodes[feature.color as ColorNames]
        : undefined,
      // Prepend symbol with 'maki-' to support mapboxDrawStyles
      symbol: feature.symbol ? `maki-${feature.symbol}` : undefined,
      description: feature.description || undefined,
      distance: feature.distance || undefined,
      area: feature.area || undefined,
    },
  };
};
