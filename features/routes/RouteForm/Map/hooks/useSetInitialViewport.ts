import { MutableRefObject, useEffect } from 'react';
import { Map } from 'mapbox-gl';

import { BoundingBox, Route } from '@/types';
import { mapBoundingBoxToLngLatBounds } from '@/utils';

type UseSetInitialViewportProps = {
  routeId?: Route['id'];
  map: MutableRefObject<Map | undefined>;
  routeMapBoundingBox?: BoundingBox;
};

export const useSetInitialViewport = ({
  routeId,
  map,
  routeMapBoundingBox,
}: UseSetInitialViewportProps) => {
  useEffect(() => {
    const mapRef = map.current;

    if (!mapRef || !routeId) return;

    if (routeMapBoundingBox) {
      const lngLatBounds = mapBoundingBoxToLngLatBounds(routeMapBoundingBox);

      // set bounds
      mapRef.fitBounds(lngLatBounds, {
        padding: 48,
        duration: 0,
      });
    }
  }, [routeId, map, routeMapBoundingBox]);
};
