import { StandardColorCodes } from '@/data/general';
import { SymbolCodes } from '@/data/routes';
import { mapboxgl } from '@/lib/client';
import { MapFeature, MapLayer } from '@/types/maps';

export const drawPoint = (
  layer: MapLayer,
  feature: MapFeature
): mapboxgl.AnyLayer => {
  const color =
    feature.properties.color || layer.color || StandardColorCodes.Red;

  const symbol =
    feature.properties.symbol || layer.symbol || SymbolCodes.Marker;

  return {
    id: feature.id,
    source: feature.id,
    type: 'symbol',
    layout: {
      'icon-image': `maki-${symbol}`,
      'icon-size': 1.25,
      'icon-offset': [0, 4],
      'icon-anchor': 'bottom',
      'icon-allow-overlap': true,
      'symbol-sort-key': 2,
    },
    paint: {
      'icon-color': color,
      'icon-halo-blur': 3,
      'icon-halo-color': 'rgba(0,0,0,0.25)',
      'icon-halo-width': 3,
    },
  };
};
