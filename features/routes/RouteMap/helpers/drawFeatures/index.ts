import { MutableRefObject } from 'react';
import { LngLatBounds, Map } from 'mapbox-gl';
import type { FeatureCollection } from 'geojson';

import { GeometryTypeNames } from '@/data/routes';
import { MapLayer, PopupState } from '@/types/maps';
import { RouteFeature, RouteLayer } from '@/types/routes';
import { getFeatureCenter, mapLayerRecordToMapLayer } from '@/utils';
import { drawLineString } from './drawLineString';
import { drawPoint } from './drawPoint';
import { drawPolygon, drawPolygonOutline } from './drawPolygon';

type DrawFeatures = {
  map: MutableRefObject<Map | undefined>;
  layers: RouteLayer[];
  features: RouteFeature[];
  openPopup: (popupState: PopupState) => void;
  mapBounds?: LngLatBounds | null;
};

export const drawFeatures = ({
  map,
  layers,
  features,
  openPopup,
  mapBounds,
}: DrawFeatures) => {
  if (!map.current) return;

  const mapRef = map.current;

  if (Array.isArray(layers) && layers.length) {
    const mapLayers: MapLayer[] = [];

    layers.forEach((layer) => {
      const layerFeatures =
        Array.isArray(features) && features.length
          ? features.filter(
              (feature) => feature.layer?.id && feature.layer.id === layer.id
            )
          : [];

      const mapLayer = mapLayerRecordToMapLayer(layer, layerFeatures);

      mapLayers.push(mapLayer);

      // add features to map
      mapLayer.data.features.forEach((feature) => {
        // add geojson source for feature
        mapRef.addSource(feature.id, {
          type: 'geojson',
          data: {
            type: mapLayer.data.type,
            features: [feature],
          } as FeatureCollection,
        });

        if (feature.geometry.type === GeometryTypeNames.Polygon) {
          // polygon feature layer
          mapRef.addLayer(drawPolygon(mapLayer, feature));
          mapRef.addLayer(drawPolygonOutline(mapLayer, feature));
        } else if (feature.geometry.type === GeometryTypeNames.LineString) {
          // linestring feature layer
          mapRef.addLayer(drawLineString(mapLayer, feature));
        } else {
          // point feature layer
          mapRef.addLayer(drawPoint(mapLayer, feature));
        }

        // create popup for click events
        mapRef.on('click', feature.id, () => {
          openPopup({
            center: getFeatureCenter(feature),
            feature,
          });
        });

        // create popup for touch events
        mapRef.on('touchend', feature.id, () => {
          openPopup({
            center: getFeatureCenter(feature),
            feature,
          });
        });
      });
    });

    if (mapBounds) {
      // set bounds
      mapRef.fitBounds(mapBounds, {
        padding: 48,
        duration: 0,
      });
    }
  }
};
