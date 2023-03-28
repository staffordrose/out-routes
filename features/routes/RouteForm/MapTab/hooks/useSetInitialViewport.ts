import { MutableRefObject, useEffect, useState } from 'react';
import { LngLatBounds, Map } from 'mapbox-gl';

import { Route } from '@/types/routes';
import {
  getAllCoordinatesFromMapLayers,
  getMapBoundsFromCoordinates,
} from '@/utils';
import { LayerValues, mapLayerValuesToMapboxLayer } from '../../helpers';

type UseSetInitialViewportProps = {
  routeId?: Route['id'];
  map: MutableRefObject<Map | undefined>;
  routeMapBounds?: LngLatBounds | null;
  layers: LayerValues[];
};

export const useSetInitialViewport = ({
  routeId,
  map,
  routeMapBounds,
  layers,
}: UseSetInitialViewportProps) => {
  // allows useEffect to run once on map load
  const [isInitialViewport, setInitialViewport] = useState(true);

  useEffect(() => {
    const mapRef = map.current;

    if (!mapRef || !isInitialViewport) return;

    if (routeMapBounds) {
      // set bounds from route record
      mapRef.fitBounds(routeMapBounds, {
        padding: 48,
        duration: 0,
      });
    } else if (
      Array.isArray(layers) &&
      layers.some(
        (layer) => Array.isArray(layer.features) && layer.features.length
      )
    ) {
      const mapLayers = layers.map((layer, layerOrder) =>
        mapLayerValuesToMapboxLayer(layerOrder, layer)
      );
      const coordinates = getAllCoordinatesFromMapLayers(mapLayers);
      const mapBounds = getMapBoundsFromCoordinates(coordinates);

      if (mapBounds) {
        // set bounds from current map features
        mapRef.fitBounds(mapBounds, {
          padding: 48,
          duration: 0,
        });
      }
    }

    setInitialViewport(false);
  }, [isInitialViewport, routeId, map, routeMapBounds, layers]);
};
