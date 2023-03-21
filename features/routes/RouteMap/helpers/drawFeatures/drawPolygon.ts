import { StandardColorCodes } from '@/data/general';
import { mapboxgl } from '@/lib/client';
import { MapFeature, MapLayer } from '@/types/maps';

export const drawPolygon = (
  layer: MapLayer,
  feature: MapFeature
): mapboxgl.AnyLayer => {
  const color =
    feature.properties.color || layer.color || StandardColorCodes.Red;

  return {
    id: feature.id, // use feature id for popup
    source: feature.id,
    type: 'fill',
    paint: {
      'fill-color': color,
      'fill-opacity': 0.25,
    },
  };
};

export const drawPolygonOutline = (
  layer: MapLayer,
  feature: MapFeature
): mapboxgl.AnyLayer => {
  const color =
    feature.properties.color || layer.color || StandardColorCodes.Red;

  return {
    id: `${feature.id}-outline`, // use alternate id
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
