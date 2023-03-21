import { StandardColorCodes } from '@/data/general';
import { mapboxgl } from '@/lib/client';
import { MapFeature, MapLayer } from '@/types/maps';

export const drawLineString = (
  layer: MapLayer,
  feature: MapFeature
): mapboxgl.AnyLayer => {
  const color =
    feature.properties.color || layer.color || StandardColorCodes.Red;

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
