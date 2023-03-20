import { GeometryTypeNames } from '@/data/routes';
import { Route } from '@/types/routes';
import {
  getAllCoordinatesFromMapLayers,
  getMapBoundsFromCoordinates,
  getMapEndLngLatEle,
  getMapStartLngLatEle,
} from '@/utils';
import { mapLayerValuesToMapboxLayer } from '../mapValuesToMapbox';
import { RouteFormResult, RouteFormValues } from '../types';

export const mapRouteValuesToRouteRecordWithFiles = (
  routeValues: RouteFormValues['route'],
  layersValues: RouteFormValues['layers']
): RouteFormResult['route'] => {
  const {
    files,
    id,
    owner,
    is_private,
    title,
    title_alt,
    activity_type,
    region,
    country,
    summary,
    image_id,
    image_full,
    image_og,
    image_banner,
    image_card_banner,
    image_thumb_360,
    image_thumb_240,
    image_thumb_120,
  } = routeValues;

  const mapLayers = layersValues.map((layer, layerIndex) =>
    mapLayerValuesToMapboxLayer(layerIndex, layer)
  );

  const coordinates = getAllCoordinatesFromMapLayers(mapLayers);
  const mapBounds = getMapBoundsFromCoordinates(coordinates);

  const {
    lng: mapStartLng,
    lat: mapStartLat,
    ele: mapStartEle,
  } = getMapStartLngLatEle(mapLayers);

  const {
    lng: mapEndLng,
    lat: mapEndLat,
    ele: mapEndEle,
  } = getMapEndLngLatEle(mapLayers);

  let mapDistance: number = 0;

  mapLayers.forEach((layer) => {
    (layer.data.features || [])
      .filter(
        (feature) => feature.geometry.type === GeometryTypeNames.LineString
      )
      .forEach((feature) => {
        if (typeof feature.properties.distance === 'number') {
          mapDistance += feature.properties.distance;
        }
      });
  });

  const route = {
    files,
    id: id as Route['id'],
    owner: owner?.id ? (owner as Route['owner']) : undefined,
    is_private: is_private === 'private' ? true : false,
    title,
    title_alt: Array.isArray(title_alt)
      ? title_alt.map(({ text }) => text)
      : [],
    activity_type,
    region,
    country,
    summary,
    map_bounding_box:
      Array.isArray(mapBounds) && mapBounds.length === 2
        ? JSON.stringify(mapBounds)
        : null,
    map_start_lng: mapStartLng || null,
    map_start_lat: mapStartLat || null,
    map_start_ele: Number(mapStartEle) || 0,
    map_end_lng: mapEndLng || null,
    map_end_lat: mapEndLat || null,
    map_end_ele: Number(mapEndEle) || 0,
    map_distance: mapDistance,
    image_id,
    image_full,
    image_og,
    image_banner,
    image_card_banner,
    image_thumb_360,
    image_thumb_240,
    image_thumb_120,
  };

  return route;
};
