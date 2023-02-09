import { MutableRefObject, useEffect } from 'react';
import { Map } from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';

import { SymbolCodes } from '@/data/routes';
import { mapboxgl } from '@/lib/client';
import { mapboxDrawStyles } from '../config';
import { MapState } from './useMapState';

type UseSetupMapProps = {
  state: MapState;
  mapContainerEl: MutableRefObject<HTMLDivElement | null>;
  map: MutableRefObject<Map | undefined>;
  draw: MutableRefObject<MapboxDraw | undefined>;
};

export const useSetupMap = ({
  state,
  mapContainerEl,
  map,
  draw,
}: UseSetupMapProps) => {
  useEffect(() => {
    // initialize map only once
    if (map.current) return;

    /**
     * map & draw initialization
     */

    map.current = new mapboxgl.Map({
      container: mapContainerEl.current as HTMLDivElement,
      style: state.mapStyle,
      center: state.viewport.center,
      zoom: state.viewport.zoom,
    });

    draw.current = new MapboxDraw({
      clickBuffer: 4,
      touchBuffer: 24,
      userProperties: true,
      styles: mapboxDrawStyles,
      controls: {
        point: true,
        line_string: true,
        polygon: true,
        trash: true,
        combine_features: false,
        uncombine_features: false,
      },
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

    // draw
    map.current.addControl(draw.current, 'top-right');

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
    });
  });
};
