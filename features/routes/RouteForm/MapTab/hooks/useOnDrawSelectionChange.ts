import { MutableRefObject, useCallback, useEffect } from 'react';
import { Map } from 'mapbox-gl';
import type MapboxDraw from '@mapbox/mapbox-gl-draw';

import { MapFeature, MapLayer, PopupState } from '@/types/maps';
import { getMapFeatureCenter } from '@/utils';
import { LayerValues, RouteFormValues } from '../../helpers';
import { MapStateActions } from './useMapState';

type OnDrawSelectionChangeProps = {
  map: MutableRefObject<Map | undefined>;
  layers: RouteFormValues['layers'];
  activeLayerId: MapLayer['id'] | null;
  openPopup: (popupState: PopupState) => void;
  setActiveLayerId: (id: MapLayer['id'] | null) => void;
  setSelectedFeatureIds: MapStateActions['setSelectedFeatureIds'];
};

export const useOnDrawSelectionChange = ({
  map,
  layers,
  activeLayerId,
  openPopup,
  setActiveLayerId,
  setSelectedFeatureIds,
}: OnDrawSelectionChangeProps) => {
  const onDrawSelectionChange = useCallback(
    async ({ features }: MapboxDraw.DrawSelectionChangeEvent) => {
      if (!Array.isArray(features) || !features.length) {
        setSelectedFeatureIds([]);
        return;
      }

      const feature = features[0];

      const cb = (layer: LayerValues) =>
        layer?.features?.some((f) => feature.id === f.databaseId);
      const nextActiveLayerId = layers.some((layer) => cb(layer))
        ? layers.find((layer) => cb(layer))?.databaseId || ''
        : '';

      if (nextActiveLayerId && nextActiveLayerId !== activeLayerId) {
        setActiveLayerId(nextActiveLayerId);
      }

      setSelectedFeatureIds(
        features
          .filter((id) => typeof id === 'string')
          .map((f) => f.id as MapFeature['id'])
      );

      if (features.length === 1) {
        openPopup({
          center: getMapFeatureCenter(feature as MapFeature),
          feature: feature as MapFeature,
        });
      }
    },
    [openPopup, layers, activeLayerId, setActiveLayerId, setSelectedFeatureIds]
  );

  useEffect(() => {
    const mapRef = map.current;

    if (mapRef) {
      const cb = (e: MapboxDraw.DrawSelectionChangeEvent) => {
        onDrawSelectionChange(e);
      };

      mapRef.on('draw.selectionchange', cb);

      return () => {
        mapRef.off('draw.selectionchange', cb);
      };
    }
  }, [map, onDrawSelectionChange]);
};
