import { GeometryTypes } from '@/data/routes';
import { Route, RouteFeature, RouteLayer } from '@/types/routes';
import {
  createAlphaNumericId,
  getAllCoordinatesFromMapLayers,
  getMapBoundsFromCoordinates,
  getMapEndLngLatEle,
  getMapStartLngLatEle,
} from '@/utils';
import { mapLayerValuesToMapLayer } from './mapLayerValuesToMapLayer';
import { RouteFormResult, RouteFormValues } from './types';

export const mapValuesToRecords = (
  values: RouteFormValues
): RouteFormResult => {
  let route: RouteFormResult['route'];
  let layers: RouteFormResult['layers'] = [];
  let features: RouteFormResult['features'] = [];

  {
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
    } = values.route;

    const mapLayers = values.layers.map((layer, layerIndex) =>
      mapLayerValuesToMapLayer(layerIndex, layer)
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

    route = {
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
      map_distance: 0, // TODO: Add functionality to calculate route distance
      image_id,
      image_full,
      image_og,
      image_banner,
      image_card_banner,
      image_thumb_360,
      image_thumb_240,
      image_thumb_120,
    };
  }

  if (Array.isArray(values.layers) && values.layers.length) {
    for (let layerIndex = 0; layerIndex < values.layers.length; layerIndex++) {
      const layer = values.layers[layerIndex];

      const layerId = layer.databaseId || createAlphaNumericId(24);

      const { title, color, symbol } = layer;

      layers.push({
        id: layerId,
        route: { id: route.id } as RouteLayer['route'],
        order: layerIndex,
        title,
        color,
        symbol,
      });

      if (Array.isArray(layer.features) && layer.features.length) {
        for (
          let featureIndex = 0;
          featureIndex < layer.features.length;
          featureIndex++
        ) {
          const feature = layer.features[featureIndex];

          /**
           * store coordinates as [lng, lat] in db
           * to be compatible with mapbox
           */
          const coordinates =
            Array.isArray(feature.coordinates) && feature.coordinates.length
              ? feature.coordinates.map(({ lat, lng }) => [
                  Number(lng),
                  Number(lat),
                ])
              : [];

          const {
            type,
            title,
            color,
            symbol,
            description,
            ele_start,
            ele_end,
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

          features.push({
            id: feature.databaseId || createAlphaNumericId(24),
            route: { id: route.id } as RouteFeature['route'],
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
            ele_start: [GeometryTypes.Point, GeometryTypes.LineString].includes(
              type as GeometryTypes
            )
              ? ele_start
              : null,
            ele_end: type === GeometryTypes.LineString ? ele_end : null,
            distance: type === GeometryTypes.LineString ? distance : null,
            area: type === GeometryTypes.Polygon ? area : null,
            image_id,
            image_full,
            image_large,
            image_card_banner,
            image_thumb_360,
            image_thumb_240,
            image_thumb_120,
          });
        }
      }
    }
  }

  return {
    route,
    layers,
    features,
  };
};
