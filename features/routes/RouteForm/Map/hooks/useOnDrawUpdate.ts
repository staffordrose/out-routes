import { MutableRefObject, useCallback, useEffect } from 'react';
import { UseFieldArrayUpdate } from 'react-hook-form';
import { Map } from 'mapbox-gl';
import type MapboxDraw from '@mapbox/mapbox-gl-draw';

import { MapFeature, MapLayer, PopupState } from '@/types';
import { getFeatureLngLat } from '@/utils';
import { RouteFormValues } from '../../helpers';
import { handleFeatureOnDraw, updateLayerFeature } from '../helpers';
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
    async (e: MapboxDraw.DrawUpdateEvent) => {
      if (!activeLayerId) return;

      const featuresPromiseArray = e.features
        .filter((feature) => feature?.id)
        .map((feature) => handleFeatureOnDraw(feature as MapFeature));

      const features: MapFeature[] = await Promise.all(featuresPromiseArray);

      features.forEach((feature) => {
        updateLayerFeature(update, layers, activeLayerId, feature);
      });

      if (
        popupFeatureId &&
        e.features.length === 1 &&
        popupFeatureId === e.features[0].id
      ) {
        openPopup({
          center: getFeatureLngLat(e.features[0] as MapFeature),
          feature: e.features[0] as MapFeature,
        });
      }
    },
    [update, layers, activeLayerId, popupFeatureId, openPopup]
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
