import { GeometryTypes } from '@/data/routes';
import { Route, RouteFeature, RouteLayer, RouteLayersFeatures } from '@/types';
import { createAlphaNumericId } from '@/utils';
import { RouteFormValues } from './types';

export const mapValuesToRecords = (
  values: RouteFormValues
): RouteLayersFeatures => {
  let route: Route;
  let layers: RouteLayer[] = [];
  let features: RouteFeature[] = [];

  {
    const {
      id,
      owner,
      is_private,
      title,
      title_alt,
      activity_type,
      region,
      country,
      ele_start,
      ele_end,
      image_id,
      image_full,
      image_og,
      image_banner,
      image_card_banner,
      image_thumb_360,
      image_thumb_240,
      image_thumb_120,
    } = values.route;

    route = {
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
      ele_start,
      ele_end,
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
