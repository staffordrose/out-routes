import { useCallback, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { Map, Popup as PopupT } from 'mapbox-gl';

import { mapboxgl } from '@/lib/client';
import { Route } from '@/types/routes';
import { Popup, PopupState } from '../components';
import { useDrawFeatures, useMapState, useSetupMap } from '.';

export type UseMapProps = {
  mapBounds?: string | null;
  routes: Route[];
};

export const useMap = ({ mapBounds, routes }: UseMapProps) => {
  const { state, setMapLoaded, setPopupFeatureId } = useMapState();

  const mapContainerEl = useRef<HTMLDivElement | null>(null);
  const popupEl = useRef<PopupT | null>(null);
  const map = useRef<Map>();

  const closePopup = useCallback(() => {
    // close existing popup
    if (popupEl.current) {
      popupEl.current.remove();
    }

    setPopupFeatureId(null);
  }, [setPopupFeatureId]);

  const openPopup = useCallback(
    ({ center, route }: PopupState) => {
      if (!map.current) return;

      closePopup();

      setPopupFeatureId(route.id);

      // create popup root
      const popupNode = document.createElement('div');
      const popupRoot = createRoot(popupNode);
      popupRoot.render(<Popup route={route} />);

      popupEl.current = new mapboxgl.Popup({
        closeButton: false,
        maxWidth: '224px',
      })
        .setLngLat(center)
        .setDOMContent(popupNode)
        .addTo(map.current);
    },
    [setPopupFeatureId, closePopup]
  );

  // initialize map, set controls & load icons
  useSetupMap({
    state,
    setMapLoaded,
    mapContainerEl,
    map,
    mapBounds,
  });

  useDrawFeatures({
    isMapLoaded: state.isMapLoaded,
    map,
    routes,
    openPopup,
  });

  return {
    mapContainerEl,
  };
};
