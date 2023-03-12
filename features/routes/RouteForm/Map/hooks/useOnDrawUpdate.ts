import { MutableRefObject, useCallback, useEffect } from 'react';
import { UseFieldArrayUpdate } from 'react-hook-form';
import { Map } from 'mapbox-gl';
import type MapboxDraw from '@mapbox/mapbox-gl-draw';

import { MapFeature, MapLayer, PopupState } from '@/types/maps';
import { getFeatureCenter } from '@/utils';
import { RouteFormValues } from '../../helpers';
import {
  addElevationToMapFeature,
  getLayerValuesById,
  handleFeatureOnDraw,
  updateLayerFeature,
} from '../helpers';
import { MapState } from './useMapState';

type OnDrawUpdateProps = {
  update: UseFieldArrayUpdate<RouteFormValues, 'layers'>;
  map: MutableRefObject<Map | undefined>;
  layers: RouteFormValues['layers'];
  activeLayerId: MapLayer['id'] | null;
  popupFeatureId: MapState['popupFeatureId'];
  openPopup: (popupState: PopupState) => void;
};

export const useOnDrawUpdate = ({
  update,
  map,
  layers,
  activeLayerId,
  popupFeatureId,
  openPopup,
}: OnDrawUpdateProps) => {
  const onDrawUpdate = useCallback(
    (e: MapboxDraw.DrawUpdateEvent) => {
      if (!map.current) return;
      if (!activeLayerId) return;

      const mapRef = map.current;

      const activeLayer = getLayerValuesById(layers, activeLayerId);

      if (!activeLayer) return;

      const activeLayerIndex = layers.findIndex(
        (layer) => layer.databaseId === activeLayerId
      );

      const featuresWithUpdatedElevation = e.features
        .filter((feature) => feature?.id)
        .map((feature) => {
          let mapFeature = feature as MapFeature;

          // add elevation for all positions
          mapFeature = addElevationToMapFeature(mapRef, mapFeature);

          return mapFeature;
        });

      const features = featuresWithUpdatedElevation.map((feature) =>
        handleFeatureOnDraw(feature)
      );

      features.forEach((feature) => {
        updateLayerFeature(update, activeLayerIndex, activeLayer, feature);
      });

      if (
        popupFeatureId &&
        features.length === 1 &&
        popupFeatureId === features[0].id
      ) {
        openPopup({
          center: getFeatureCenter(features[0] as MapFeature),
          feature: features[0] as MapFeature,
        });
      }
    },
    [update, map, layers, activeLayerId, popupFeatureId, openPopup]
  );

  useEffect(() => {
    const mapRef = map.current;

    if (mapRef) {
      const cb = (e: MapboxDraw.DrawUpdateEvent) => {
        onDrawUpdate(e);
      };

      mapRef.on('draw.update', cb);

      return () => {
        mapRef.off('draw.update', cb);
      };
    }
  }, [map, onDrawUpdate]);
};
