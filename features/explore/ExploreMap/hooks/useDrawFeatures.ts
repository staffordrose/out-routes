import { MutableRefObject, useCallback, useEffect } from 'react';
import type { Map } from 'mapbox-gl';
import type { FeatureCollection } from 'geojson';

import { GeometryTypeNames } from '@/data/routes';
import { Route } from '@/types/routes';
import { PopupState } from '../components';
import { drawPoint } from '../helpers';
import { MapState } from './useMapState';

type UseDrawFeatures = {
  isMapLoaded: MapState['isMapLoaded'];
  map: MutableRefObject<Map | undefined>;
  routes: Route[];
  openPopup: (popupState: PopupState) => void;
};

export const useDrawFeatures = ({
  isMapLoaded,
  map,
  routes,
  openPopup,
}: UseDrawFeatures) => {
  const drawFeatures = useCallback(() => {
    if (!map.current) return;

    const mapRef = map.current;

    if (Array.isArray(routes) && routes.length) {
      routes.forEach((route) => {
        // prevent feature from being drawn more than once
        if (mapRef.getSource(route.id)) return;

        const coordinates: [number, number] = [
          route.map_start_lng || 0,
          route.map_start_lat || 0,
        ];

        mapRef.addSource(route.id, {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [
              {
                id: route.id,
                type: 'Feature',
                geometry: {
                  type: GeometryTypeNames.Point,
                  coordinates,
                },
                properties: {},
              },
            ],
          } as FeatureCollection,
        });

        // point feature layer
        mapRef.addLayer(drawPoint(route));

        // create popup for click events
        mapRef.on('click', route.id, () => {
          openPopup({
            center: coordinates,
            route,
          });
        });

        // create popup for touch events
        mapRef.on('touchend', route.id, () => {
          openPopup({
            center: coordinates,
            route,
          });
        });
      });
    }
  }, [map, routes, openPopup]);

  useEffect(() => {
    if (isMapLoaded) {
      drawFeatures();
    }
  }, [isMapLoaded, drawFeatures]);
};
