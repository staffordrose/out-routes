import { MutableRefObject, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Map } from 'mapbox-gl';
import geoViewport, { GeoViewport } from '@mapbox/geo-viewport';
import queryString from 'query-string';
import debounce from 'lodash.debounce';

import { SymbolCodes } from '@/data/routes';
import { mapboxgl } from '@/lib/client';
import { getMapBounds, shallowPush } from '@/utils';
import { MapState, MapStateActions } from './useMapState';

type UseSetupMapProps = {
  state: MapState;
  setMapLoaded: MapStateActions['setMapLoaded'];
  mapContainerEl: MutableRefObject<HTMLDivElement | null>;
  map: MutableRefObject<Map | undefined>;
  mapBounds?: string | null;
};

export const useSetupMap = ({
  state,
  setMapLoaded,
  mapContainerEl,
  map,
  mapBounds,
}: UseSetupMapProps) => {
  const router = useRouter();

  useEffect(() => {
    // initialize map only once
    if (map.current) return;

    /**
     * map initialization
     */

    let geo: GeoViewport | { center: undefined; zoom: undefined } = {
      center: undefined,
      zoom: undefined,
    };

    if (mapBounds) {
      const { width, height } =
        mapContainerEl.current?.getBoundingClientRect() || {};

      const boundsArr: [number, number][] = JSON.parse(mapBounds);
      geo = geoViewport.viewport(
        [...boundsArr[0], ...boundsArr[1]],
        [width ?? 1276, height ?? 536]
      );
    }

    map.current = new mapboxgl.Map({
      container: mapContainerEl.current as HTMLDivElement,
      style: state.mapStyle,
      center: geo.center,
      zoom: geo.zoom,
    });

    const mapRef = map.current;

    /**
     * map controls
     */

    // navigation
    mapRef.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

    // geolocation
    mapRef.addControl(new mapboxgl.GeolocateControl(), 'bottom-right');

    // scale
    mapRef.addControl(
      new mapboxgl.ScaleControl({
        unit: state.controls.scale.unit,
      }),
      'bottom-left'
    );

    /**
     * map callbacks
     */

    // load
    mapRef.on('load', () => {
      setMapLoaded(true);

      // load map symbols
      Object.values(SymbolCodes).forEach((symbol) => {
        mapRef.loadImage(
          `/symbols-png/${symbol}.png`,
          (error?: Error, image?: ImageBitmap | HTMLImageElement) => {
            if (error) throw error;
            if (!mapRef.hasImage(`maki-${symbol}`) && image) {
              mapRef.addImage(`maki-${symbol}`, image, { sdf: true });
            }
          }
        );
      });
    });

    // move end
    mapRef.on(
      'moveend',
      debounce(() => {
        const bounds = getMapBounds(map);

        shallowPush(
          router,
          `/explore?${queryString.stringify({
            bounds: bounds ? JSON.stringify(bounds) : undefined,
          })}`
        );
      }, 600)
    );

    // zoom end
    mapRef.on(
      'zoomend',
      debounce(() => {
        const bounds = getMapBounds(map);

        shallowPush(
          router,
          `/explore?${queryString.stringify({
            bounds: bounds ? JSON.stringify(bounds) : undefined,
          })}`
        );
      }, 600)
    );
  });
};
