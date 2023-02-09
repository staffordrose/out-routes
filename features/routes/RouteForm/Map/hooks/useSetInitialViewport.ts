import { MutableRefObject, useEffect } from 'react';
import { LngLatBounds, Map } from 'mapbox-gl';

import { Route } from '@/types';

type UseSetInitialViewportProps = {
  routeId?: Route['id'];
  map: MutableRefObject<Map | undefined>;
  routeMapBounds?: LngLatBounds | null;
};

export const useSetInitialViewport = ({
  routeId,
  map,
  routeMapBounds,
}: UseSetInitialViewportProps) => {
  useEffect(() => {
    const mapRef = map.current;

    if (!mapRef || !routeId) return;

    if (routeMapBounds) {
      // set bounds
      mapRef.fitBounds(routeMapBounds, {
        padding: 48,
        duration: 0,
      });
    }
  }, [routeId, map, routeMapBounds]);
};
