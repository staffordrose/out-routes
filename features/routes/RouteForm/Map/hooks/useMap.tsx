import { useCallback, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { UseFieldArrayUpdate, useFormContext, useWatch } from 'react-hook-form';
import { Map, Popup as PopupT } from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';

import { mapboxgl } from '@/lib/client';
import { BoundingBox, MapLayer, PopupState, Route } from '@/types';
import { RouteFormValues } from '../../helpers';
import { Popup } from '../components';
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
  update: UseFieldArrayUpdate<RouteFormValues, 'layers'>;
  routeId: Route['id'];
  routeMapBoundingBox?: BoundingBox;
};

export const useMap = ({
  update,
  routeId,
  routeMapBoundingBox,
}: UseMapProps) => {
  const { state, setSelectedFeatureIds, setPopupFeatureId } = useMapState();

  const { control, setValue } = useFormContext<RouteFormValues>();
  const layers = useWatch({ control, name: 'layers' });
  const activeLayerId = useWatch({ control, name: 'activeLayerId' });

  const setActiveLayerId = useCallback(
    (id: MapLayer['id'] | null) => setValue('activeLayerId', id),
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
    routeMapBoundingBox,
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

      // create popup root
      const popupNode = document.createElement('div');
      const popupRoot = createRoot(popupNode);
      popupRoot.render(
        <Popup
          update={update}
          layers={layers}
          activeLayerId={activeLayerId}
          feature={feature}
          closePopup={closePopup}
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
    [update, layers, activeLayerId, setPopupFeatureId, closePopup]
  );

  useOnDrawCreate({
    update,
    map,
    draw,
    layers,
    activeLayerId,
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
    openPopup,
  };
};
