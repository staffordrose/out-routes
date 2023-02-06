import { MutableRefObject, useCallback, useEffect } from 'react';
import { UseFieldArrayUpdate } from 'react-hook-form';
import { Map } from 'mapbox-gl';
import type MapboxDraw from '@mapbox/mapbox-gl-draw';

import { MapFeature } from '@/types';
import { RouteFormValues } from '../../helpers';
import { deleteLayerFeature } from '../helpers';

type OnDrawDeleteProps = {
  update: UseFieldArrayUpdate<RouteFormValues, 'layers'>;
  map: MutableRefObject<Map | undefined>;
  layers: RouteFormValues['layers'];
  closePopup: () => void;
};

export const useOnDrawDelete = ({
  update,
  map,
  layers,
  closePopup,
}: OnDrawDeleteProps) => {
  const onDrawDelete = useCallback(
    async (e: MapboxDraw.DrawDeleteEvent) => {
      closePopup();

      e.features.forEach((feature) => {
        let layerId =
          feature.properties?.layer ||
          layers.find((layer) =>
            layer.features?.some((f) => f.databaseId === feature.id)
          )?.databaseId;

        if (!layerId) return;

        deleteLayerFeature(update, layers, layerId, feature as MapFeature);
      });
    },
    [update, layers, closePopup]
  );

  useEffect(() => {
    const mapRef = map.current;

    if (mapRef) {
      const cb = (e: MapboxDraw.DrawDeleteEvent) => {
        onDrawDelete(e);
      };
      mapRef.on('draw.delete', cb);

      return () => {
        mapRef.off('draw.delete', cb);
      };
    }
  }, [map, onDrawDelete]);
};
