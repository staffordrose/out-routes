import { GeometryTypes } from '@/data/routes';
import { Route, RouteFeature, RouteLayer } from '@/types/routes';
import { createAlphaNumericId } from '@/utils';
import { FeatureValues } from '../types';

export const mapFeatureValuesToFeatureRecord = (
  routeId: Route['id'],
  layerId: RouteLayer['id'],
  featureIndex: number,
  feature: FeatureValues
): RouteFeature => {
  /**
   * store coordinates as [lng, lat, ele?] in db
   * to be compatible with mapbox
   */
  const coordinates =
    Array.isArray(feature.coordinates) && feature.coordinates.length
      ? feature.coordinates.map(({ lat, lng, ele }) => {
          const position = [Number(lng), Number(lat)];

          if (!isNaN(Number(ele))) {
            position.push(Number(ele));
          }

          return position;
        })
      : [];

  const {
    type,
    title,
    color,
    symbol,
    description,
    distance,
    area,
    image_id,
    image_full,
    image_large,
    image_card_banner,
    image_thumb_360,
    image_thumb_240,
    image_thumb_120,
  } = feature;

  const ele_start = [GeometryTypes.Point, GeometryTypes.LineString].includes(
    type as GeometryTypes
  )
    ? coordinates[0][2]
    : null;

  const ele_end = [GeometryTypes.Point, GeometryTypes.LineString].includes(
    type as GeometryTypes
  )
    ? coordinates[coordinates.length - 1][2]
    : null;

  return {
    id: feature.databaseId || createAlphaNumericId(24),
    route: { id: routeId } as RouteFeature['route'],
    layer: { id: layerId } as RouteFeature['layer'],
    order: featureIndex,
    type,
    coordinates: JSON.stringify(
      type === GeometryTypes.Polygon
        ? [coordinates]
        : type === GeometryTypes.LineString
        ? coordinates
        : coordinates[0]
    ),
    title,
    color,
    symbol: type === GeometryTypes.Point ? symbol : null,
    description,
    ele_start,
    ele_end,
    distance: type === GeometryTypes.LineString ? distance : null,
    area: type === GeometryTypes.Polygon ? area : null,
    image_id,
    image_full,
    image_large,
    image_card_banner,
    image_thumb_360,
    image_thumb_240,
    image_thumb_120,
  };
};
