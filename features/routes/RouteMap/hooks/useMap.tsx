import { useCallback, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { LngLatBounds, Map, Popup as PopupT } from 'mapbox-gl';

import { mapboxgl } from '@/lib/client';
import { PopupState } from '@/types/maps';
import { RouteFeature, RouteLayer } from '@/types/routes';
import { RouteMapPopup } from '../../RouteMapPopup';
import { useMapState, useSetupMap } from '.';

export type UseMapProps = {
  mapBounds?: LngLatBounds | null;
  layers: RouteLayer[];
  features: RouteFeature[];
};

export const useMap = ({ mapBounds, layers, features }: UseMapProps) => {
  const { state, setPopupFeatureId } = useMapState();

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
    ({ center, feature }: PopupState) => {
      if (!map.current) return;

      closePopup();

      setPopupFeatureId(feature.id);

      // create popup root
      const popupNode = document.createElement('div');
      const popupRoot = createRoot(popupNode);
      popupRoot.render(
        <RouteMapPopup>
          <RouteMapPopup.Header feature={feature} />
          <RouteMapPopup.Content feature={feature} />
        </RouteMapPopup>
      );

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
    mapContainerEl,
    map,
    layers,
    features,
    openPopup,
    mapBounds,
  });

  return {
    mapContainerEl,
    map,
    openPopup,
  };
};
