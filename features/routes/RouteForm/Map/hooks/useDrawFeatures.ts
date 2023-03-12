import { MutableRefObject, useEffect } from 'react';
import { Map } from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import type { FeatureCollection } from 'geojson';

import {
  mapFeatureValuesToMapboxFeature,
  RouteFormValues,
} from '../../helpers';

type UseDrawFeaturesProps = {
  map: MutableRefObject<Map | undefined>;
  draw: MutableRefObject<MapboxDraw | undefined>;
  layers: RouteFormValues['layers'];
};

export const useDrawFeatures = ({
  map,
  draw,
  layers,
}: UseDrawFeaturesProps) => {
  useEffect(() => {
    if (!map.current || !draw.current) return;

    const drawRef = draw.current;

    drawRef.deleteAll();

    if (Array.isArray(layers) && layers.length) {
      layers.forEach((layer) => {
        drawRef.add({
          type: 'FeatureCollection',
          features:
            layer.features?.map((feature, featureOrder) =>
              mapFeatureValuesToMapboxFeature(
                {
                  id: layer.databaseId as string,
                  symbol: layer.symbol,
                  color: layer.color,
                },
                featureOrder,
                feature
              )
            ) || [],
        } as FeatureCollection);
      });
    }
  }, [map, draw, layers]);
};
