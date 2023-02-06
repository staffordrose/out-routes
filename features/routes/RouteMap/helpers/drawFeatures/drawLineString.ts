import mapboxgl from 'mapbox-gl';

import { ColorCodes } from '@/data/general';
import { MapFeature, MapLayer } from '@/types';

export const drawLineString = (
  layer: MapLayer,
  feature: MapFeature
): mapboxgl.AnyLayer => {
  const color = feature.properties.color || layer.color || ColorCodes.Red;

  return {
    id: feature.id,
    source: feature.id,
    type: 'line',
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
    paint: {
      'line-color': color,
      'line-width': 4,
    },
  };
};
