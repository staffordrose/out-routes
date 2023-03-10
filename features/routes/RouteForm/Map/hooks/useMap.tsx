import { useCallback, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import {
  UseFieldArrayAppend,
  UseFieldArrayUpdate,
  useFormContext,
  useWatch,
} from 'react-hook-form';
import { LngLatBounds, Map, Popup as PopupT } from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';

import { mapboxgl } from '@/lib/client';
import { MapFeature, MapLayer, PopupState } from '@/types/maps';
import { Route } from '@/types/routes';
import { LayerValues, RouteFormValues } from '../../helpers';
import { Popup } from '../components';
import { getLayerValuesById } from '../helpers';
import {
  useDrawFeatures,
  useMapState,
  useOnDrawCreate,
  useOnDrawDelete,
  useOnDrawSelectionChange,
  useOnDrawUpdate,
  useSetInitialViewport,
  useSetupMap,
} from '../hooks';

export type UseMapProps = {
  append: UseFieldArrayAppend<RouteFormValues, 'layers'>;
  update: UseFieldArrayUpdate<RouteFormValues, 'layers'>;
  routeId: Route['id'];
  routeMapBounds?: LngLatBounds | null;
  openFeatureEditDialog: (
    layerIndex: number,
    layer: LayerValues,
    feature: MapFeature
  ) => void;
};

export const useMap = ({
  append,
  update,
  routeId,
  routeMapBounds,
  openFeatureEditDialog,
}: UseMapProps) => {
  const { state, setSelectedFeatureIds, setPopupFeatureId } = useMapState();

  const { control, setValue } = useFormContext<RouteFormValues>();
  const layers = useWatch({ control, name: 'layers' });
  const activeLayerId = useWatch({ control, name: 'activeLayerId' });

  const setActiveLayerId = useCallback(
    (id: MapLayer['id'] | null) => {
      setValue('activeLayerId', id);
    },
    [setValue]
  );

  const mapContainerEl = useRef<HTMLDivElement | null>(null);
  const popupEl = useRef<PopupT | null>(null);
  const map = useRef<Map>();
  const draw = useRef<MapboxDraw>();

  // initialize map & draw, set controls & load icons
  useSetupMap({
    state,
    mapContainerEl,
    map,
    draw,
  });

  useSetInitialViewport({
    routeId,
    map,
    routeMapBounds,
  });

  useDrawFeatures({
    map,
    draw,
    layers,
  });

  const closePopup = useCallback(() => {
    // close existing popup
    if (popupEl.current) {
      popupEl.current.remove();
    }

    setPopupFeatureId(null);
  }, [setPopupFeatureId]);

  const openPopup = useCallback(
    ({ center, feature }: PopupState): void => {
      if (!map.current) return;

      closePopup();

      setPopupFeatureId(feature.id);

      const layer = getLayerValuesById(layers, feature.properties.layer);

      if (!layer) return;

      // create popup root
      const popupNode = document.createElement('div');
      const popupRoot = createRoot(popupNode);
      popupRoot.render(
        <Popup
          layerIndex={layers.findIndex(
            (layer) => layer.databaseId === feature.properties.layer
          )}
          layer={layer}
          feature={feature}
          openFeatureEditDialog={openFeatureEditDialog}
        />
      );

      popupEl.current = new mapboxgl.Popup({
        closeButton: false,
        maxWidth: '224px',
      })
        .setLngLat(center)
        .setDOMContent(popupNode)
        .addTo(map.current);
    },
    [layers, setPopupFeatureId, closePopup, openFeatureEditDialog]
  );

  useOnDrawCreate({
    append,
    update,
    map,
    draw,
    layers,
    activeLayerId,
    setActiveLayerId,
  });

  useOnDrawUpdate({
    update,
    map,
    openPopup,
    layers,
    activeLayerId,
    popupFeatureId: state.popupFeatureId,
  });

  useOnDrawDelete({
    update,
    map,
    layers,
    closePopup,
  });

  useOnDrawSelectionChange({
    map,
    layers,
    activeLayerId,
    openPopup,
    setActiveLayerId,
    setSelectedFeatureIds,
  });

  return {
    mapContainerEl,
    map,
    draw,
    openPopup,
    closePopup,
    setActiveLayerId,
  };
};
