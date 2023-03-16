import type { MutableRefObject } from 'react';
import type { LngLatBoundsLike, Map } from 'mapbox-gl';

import { round } from '../arithmetic';

export const getCurrentMapBounds = (
  map: MutableRefObject<Map | undefined>
): LngLatBoundsLike | null => {
  const bounds = map.current?.getBounds();
  const arr = bounds?.toArray();

  if (!Array.isArray(arr)) return null;

  return [
    [round(arr[0][0], 6), round(arr[0][1], 6)],
    [round(arr[1][0], 6), round(arr[1][1], 6)],
  ];
};
