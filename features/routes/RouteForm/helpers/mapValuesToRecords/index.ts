import { RouteFormResult, RouteFormValues } from '../types';
import { mapLayerValuesToLayerAndFeatureRecords } from './mapLayerValuesToLayerAndFeatureRecords';
import { mapRouteValuesToRouteRecordWithFiles } from './mapRouteValuesToRouteRecordWithFiles';

export * from './mapFeatureValuesToFeatureRecord';
export {
  mapLayerValuesToLayerAndFeatureRecords,
  mapRouteValuesToRouteRecordWithFiles,
};

export const mapValuesToRecords = (
  values: RouteFormValues
): RouteFormResult => {
  const route = mapRouteValuesToRouteRecordWithFiles(
    values.route,
    values.layers
  );

  const layers: RouteFormResult['layers'] = [];
  let features: RouteFormResult['features'] = [];

  if (Array.isArray(values.layers) && values.layers.length) {
    for (let layerIndex = 0; layerIndex < values.layers.length; layerIndex++) {
      const layer = values.layers[layerIndex];

      const { layer: layerRecord, features: featureRecords } =
        mapLayerValuesToLayerAndFeatureRecords(
          values.route.id,
          layerIndex,
          layer
        );

      layers.push(layerRecord);
      features = features.concat(featureRecords);
    }
  }

  return {
    route,
    layers,
    features,
  };
};
