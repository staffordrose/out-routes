import { MutableRefObject, useEffect } from 'react';
import { Map } from 'mapbox-gl';

import { mapboxgl } from '@/lib/client';
import { LngLat, Route, Viewport } from '@/types';
import { MapStateActions } from './useMapState';

type UseSetInitialViewportProps = {
  routeId?: Route['id'];
  map: MutableRefObject<Map | undefined>;
  setViewport: MapStateActions['setViewport'];
};

export const useSetInitialViewport = ({
  routeId,
  map,
  setViewport,
}: UseSetInitialViewportProps) => {
  useEffect(() => {
    const mapRef = map.current;

    if (!mapRef || !routeId) return;

    let center: LngLat | undefined;
    const lsCenter = localStorage.getItem(`mapid:${routeId}-center`);
    if (lsCenter) {
      center = JSON.parse(lsCenter);
    }

    let zoom: number | undefined;
    const lsZoom = Number(localStorage.getItem(`mapid:${routeId}-zoom`));
    if (lsZoom) {
      zoom = lsZoom;
    }

    if (Array.isArray(center) && typeof zoom === 'number') {
      setViewport({ center, zoom } as Viewport);

      mapRef.jumpTo({
        center,
        offset: [0, 0],
        zoom,
      } as mapboxgl.CameraOptions);
    } else if (center) {
      setViewport({
        center,
      });

      mapRef.jumpTo({
        center,
        offset: [0, 0],
      } as mapboxgl.CameraOptions);
    } else if (typeof zoom === 'number') {
      setViewport({ zoom });
    }
  }, [routeId, map, setViewport]);
};
