import { MutableRefObject, useCallback, useEffect } from 'react';
import { UseFieldArrayAppend, UseFieldArrayUpdate } from 'react-hook-form';
import { Map } from 'mapbox-gl';
import type MapboxDraw from '@mapbox/mapbox-gl-draw';

import { ColorCodes } from '@/data/general';
import { SymbolCodes } from '@/data/routes';
import { MapFeature, MapLayer } from '@/types/maps';
import { createAlphaNumericId } from '@/utils';
import { mapMapFeatureToFeatureValues, RouteFormValues } from '../../helpers';
import {
  addElevationToMapFeature,
  addLayerFeature,
  handleFeatureOnDraw,
} from '../helpers';

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
    (e: MapboxDraw.DrawCreateEvent) => {
      if (!map.current) return;
      if (!draw.current) return;

      const mapRef = map.current;
      const drawRef = draw.current;

      const featuresWithIdAndElevation = e.features
        .filter((feature) => feature?.id)
        .map((feature) => {
          // remove feature with auto-generated id
          drawRef.delete(feature.id?.toString() as string);

          const id: MapFeature['id'] = createAlphaNumericId(24);

          // add custom id
          let mapFeature = {
            ...feature,
            id,
          } as MapFeature;

          // add elevation for all positions
          mapFeature = addElevationToMapFeature(mapRef, mapFeature);

          drawRef.add(mapFeature);

          return mapFeature;
        });

      const features = featuresWithIdAndElevation.map((feature) =>
        handleFeatureOnDraw(feature)
      );

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
    [append, update, map, draw, layers, activeLayerId, setActiveLayerId]
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
