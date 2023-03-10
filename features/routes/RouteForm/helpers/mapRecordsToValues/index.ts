import { Route, RouteFeature, RouteLayer } from '@/types/routes';
import { mapLayerAndFeatureRecordsToLayerValues } from './mapLayerAndFeatureRecordsToLayerValues';
import { mapRouteRecordToRouteValues } from './mapRouteRecordToRouteValues';
import { RouteFormValues } from '../types';

export * from './mapFeatureRecordToFeatureValues';
export { mapLayerAndFeatureRecordsToLayerValues, mapRouteRecordToRouteValues };

export const mapRecordsToValues = (
  route: Route,
  layers: RouteLayer[],
  features: RouteFeature[]
): RouteFormValues => {
  return {
    route: mapRouteRecordToRouteValues(route),
    layers:
      Array.isArray(layers) && layers.length
        ? layers
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((layer) => {
              const layerFeatures = Array.isArray(features)
                ? features.filter(
                    (feature) =>
                      feature.layer?.id && feature.layer.id === layer.id
                  )
                : [];

              return mapLayerAndFeatureRecordsToLayerValues(
                layer,
                layerFeatures
              );
            })
        : [],
    activeLayerId: Array.isArray(layers) && layers.length ? layers[0].id : null,
  };
};
