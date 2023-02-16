import { MutableRefObject, useCallback, useEffect } from 'react';
import { UseFieldArrayAppend, UseFieldArrayUpdate } from 'react-hook-form';
import { Map } from 'mapbox-gl';
import type MapboxDraw from '@mapbox/mapbox-gl-draw';

import { ColorCodes } from '@/data/general';
import { SymbolCodes } from '@/data/routes';
import { MapFeature, MapLayer } from '@/types';
import { createAlphaNumericId } from '@/utils';
import { mapMapFeatureToFeatureValues, RouteFormValues } from '../../helpers';
import { addLayerFeature, handleFeatureOnDraw } from '../helpers';

type OnDrawCreateProps = {
  append: UseFieldArrayAppend<RouteFormValues, 'layers'>;
  update: UseFieldArrayUpdate<RouteFormValues, 'layers'>;
  map: MutableRefObject<Map | undefined>;
  draw: MutableRefObject<MapboxDraw | undefined>;
  layers: RouteFormValues['layers'];
  activeLayerId: MapLayer['id'] | null;
  setActiveLayerId: (id: MapLayer['id'] | null) => void;
};

export const useOnDrawCreate = ({
  append,
  update,
  map,
  draw,
  layers,
  activeLayerId,
  setActiveLayerId,
}: OnDrawCreateProps) => {
  const onDrawCreate = useCallback(
    async (e: MapboxDraw.DrawCreateEvent) => {
      if (!draw.current) return;

      const drawRef = draw.current;

      const featuresWithId = e.features
        .filter((feature) => feature?.id)
        .map((feature) => {
          // remove feature with auto-generated id
          drawRef.delete(feature.id?.toString() as string);

          const id: MapFeature['id'] = createAlphaNumericId(24);

          // add feature with custom id
          drawRef.add({
            ...feature,
            id,
          });

          return drawRef.get(id) as MapFeature;
        });

      const featuresPromiseArray = featuresWithId.map((feature) =>
        handleFeatureOnDraw(feature)
      );

      const features: MapFeature[] = await Promise.all(featuresPromiseArray);

      if (!activeLayerId) {
        const newLayerId = createAlphaNumericId(24);

        append({
          databaseId: newLayerId,
          title: '',
          color: ColorCodes.Red,
          symbol: SymbolCodes.Marker,
          features: features.map((feature) =>
            mapMapFeatureToFeatureValues(feature)
          ),
        });

        setActiveLayerId(newLayerId);
      } else {
        features.forEach((feature) => {
          addLayerFeature(update, layers, activeLayerId, feature);
        });
      }
    },
    [append, update, draw, layers, activeLayerId, setActiveLayerId]
  );

  useEffect(() => {
    const mapRef = map.current;

    if (mapRef && draw.current) {
      const cb = (e: MapboxDraw.DrawCreateEvent) => {
        onDrawCreate(e);
      };

      mapRef.on('draw.create', cb);

      return () => {
        mapRef.off('draw.create', cb);
      };
    }
  }, [map, draw, onDrawCreate]);
};
