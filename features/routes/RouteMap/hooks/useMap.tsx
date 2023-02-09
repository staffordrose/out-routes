import { useCallback, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { Map, Popup as PopupT } from 'mapbox-gl';

import { mapboxgl } from '@/lib/client';
import { PopupState, Route, RouteFeature, RouteLayer } from '@/types';
import { parseMapBounds } from '@/utils';
import { Popup } from '../components';
import { useMapState, useSetupMap } from '../hooks';

export type UseMapProps = {
  route: Route;
  layers: RouteLayer[];
  features: RouteFeature[];
};

export const useMap = ({ route, layers, features }: UseMapProps) => {
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
      popupRoot.render(<Popup feature={feature} />);

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
    mapBounds: parseMapBounds(route.map_bounding_box),
  });

  return {
    mapContainerEl,
    openPopup,
  };
};
