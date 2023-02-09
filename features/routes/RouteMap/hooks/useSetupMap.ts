import { MutableRefObject, useEffect } from 'react';
import { Map } from 'mapbox-gl';

import { SymbolCodes } from '@/data/routes';
import { mapboxgl } from '@/lib/client';
import { BoundingBox, PopupState, RouteFeature, RouteLayer } from '@/types';
import { drawFeatures } from '../helpers';
import { MapState } from './useMapState';

type UseSetupMapProps = {
  state: MapState;
  mapContainerEl: MutableRefObject<HTMLDivElement | null>;
  map: MutableRefObject<Map | undefined>;
  layers: RouteLayer[];
  features: RouteFeature[];
  openPopup: (popupState: PopupState) => void;
  mapBoundingBox?: BoundingBox;
};

export const useSetupMap = ({
  state,
  mapContainerEl,
  map,
  layers,
  features,
  openPopup,
  mapBoundingBox,
}: UseSetupMapProps) => {
  useEffect(() => {
    // initialize map only once
    if (map.current) return;

    /**
     * map initialization
     */

    map.current = new mapboxgl.Map({
      container: mapContainerEl.current as HTMLDivElement,
      style: state.mapStyle,
      center: state.viewport.center,
      zoom: state.viewport.zoom,
    });

    /**
     * map controls
     */

    // navigation
    map.current.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

    // geolocation
    map.current.addControl(new mapboxgl.GeolocateControl(), 'bottom-right');

    // scale
    map.current.addControl(
      new mapboxgl.ScaleControl({
        unit: state.controls.scale.unit,
      }),
      'bottom-left'
    );

    /**
     * map callbacks
     */

    // load
    map.current.on('load', () => {
      // load map symbols
      Object.values(SymbolCodes).forEach((symbol) => {
        map.current?.loadImage(
          `/symbols-png/${symbol}.png`,
          (error?: Error, image?: ImageBitmap | HTMLImageElement) => {
            if (error) throw error;
            if (!map.current?.hasImage(`maki-${symbol}`) && image) {
              map.current?.addImage(`maki-${symbol}`, image, { sdf: true });
            }
          }
        );
      });

      // draw map features
      drawFeatures({
        map,
        layers,
        features,
        openPopup,
        mapBoundingBox,
      });
    });
  });
};
