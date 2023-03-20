import { useCallback, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { LngLatBounds, Map, Marker, Popup } from 'mapbox-gl';

import { mapboxgl } from '@/lib/client';
import { LngLat, PopupState } from '@/types/maps';
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

  const mapContainerEl = useRef<HTMLDivElement>(null);
  const map = useRef<Map>();
  const popupEl = useRef<Popup | null>(null);
  const trackMarkerEl = useRef<Marker | null>(null);

  const openPopup = useCallback(
    ({ center, feature }: PopupState) => {
      if (!map.current) return;

      // close existing popup
      if (popupEl.current) {
        popupEl.current.remove();
      }

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
    [setPopupFeatureId]
  );

  const closePopup = useCallback(() => {
    if (popupEl.current) {
      popupEl.current.remove();
    }

    setPopupFeatureId(null);
  }, [setPopupFeatureId]);

  const setTrackMarker = useCallback((lngLat: LngLat) => {
    if (!map.current) return;

    // hide track marker
    if (trackMarkerEl.current) {
      trackMarkerEl.current.remove();
    }

    const markerNode = document.createElement('div');
    markerNode.className = 'mapboxgl-track-marker';

    trackMarkerEl.current = new mapboxgl.Marker(markerNode)
      .setLngLat(lngLat)
      .addTo(map.current);
  }, []);

  const hideTrackMarker = useCallback(() => {
    if (trackMarkerEl.current) {
      trackMarkerEl.current.remove();
    }
  }, []);

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
    closePopup,
    setTrackMarker,
    hideTrackMarker,
  };
};
