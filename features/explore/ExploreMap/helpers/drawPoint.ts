import { StandardColorCodes } from '@/data/general';
import { SymbolCodes } from '@/data/routes';
import { mapboxgl } from '@/lib/client';
import { Route } from '@/types/routes';

export const drawPoint = (route: Route): mapboxgl.AnyLayer => {
  return {
    id: route.id,
    source: route.id,
    type: 'symbol',
    layout: {
      'icon-image': `maki-${SymbolCodes.Marker}`,
      'icon-size': 1.25,
      'icon-offset': [0, 4],
      'icon-anchor': 'bottom',
      'icon-allow-overlap': true,
    },
    paint: {
      'icon-color': StandardColorCodes.Red,
      'icon-halo-blur': 3,
      'icon-halo-color': 'rgba(0,0,0,0.25)',
      'icon-halo-width': 3,
    },
  };
};
