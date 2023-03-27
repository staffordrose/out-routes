import { MutableRefObject, useCallback, useEffect } from 'react';
import { UseFieldArrayAppend, UseFieldArrayUpdate } from 'react-hook-form';
import { Map } from 'mapbox-gl';
import type MapboxDraw from '@mapbox/mapbox-gl-draw';

import { StandardColorNames } from '@/data/general';
import { SymbolCodes } from '@/data/routes';
import { MapFeature, MapLayer } from '@/types/maps';
import { createAlphaNumericId } from '@/utils';
import {
  mapMapboxFeatureToFeatureValues,
  RouteFormValues,
} from '../../helpers';
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
    async (e: MapboxDraw.DrawCreateEvent) => {
      try {
        if (!draw.current) return;

        const drawRef = draw.current;

        const filteredFeatures = e.features.filter((feature) => feature?.id);

        const featuresPromiseArray = filteredFeatures.map(async (feature) => {
          // add custom id
          let mapFeature = {
            ...feature,
            id: createAlphaNumericId(24),
          } as MapFeature;

          // add elevation for all positions
          mapFeature = await addElevationToMapFeature(mapFeature);

          // remove feature with auto-generated id
          drawRef.delete((feature.id || '').toString());

          drawRef.add(mapFeature);

          return mapFeature;
        });

        const featuresWithEle = await Promise.all(featuresPromiseArray);

        const features = featuresWithEle.map((feature) =>
          handleFeatureOnDraw(feature)
        );

        if (!activeLayerId) {
          const newLayerId = createAlphaNumericId(24);

          append({
            databaseId: newLayerId,
            title: '',
            color: StandardColorNames.Red,
            symbol: SymbolCodes.Marker,
            features: features.map((feature) =>
              mapMapboxFeatureToFeatureValues(feature)
            ),
          });

          setActiveLayerId(newLayerId);
        } else {
          features.forEach((feature) => {
            addLayerFeature(update, layers, activeLayerId, feature);
          });
        }
      } catch (error) {
        if (error instanceof Error) {
          // TODO: Open toast
          console.error(error);
        }
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
