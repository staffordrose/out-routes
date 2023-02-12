import type { MutableRefObject } from 'react';
import type { LngLatBoundsLike, Map } from 'mapbox-gl';

import { roundToDecimalCount } from '../../arithmetic';

export const getMapBounds = (
  mapRef: MutableRefObject<Map | undefined>
): LngLatBoundsLike | null => {
  const bounds = mapRef.current?.getBounds();
  const arr = bounds?.toArray();

  if (!Array.isArray(arr)) return null;

  return [
    [
      roundToDecimalCount(arr[0][0], { decimalCount: 6 }),
      roundToDecimalCount(arr[0][1], { decimalCount: 6 }),
    ],
    [
      roundToDecimalCount(arr[1][0], { decimalCount: 6 }),
      roundToDecimalCount(arr[1][1], { decimalCount: 6 }),
    ],
  ];
};
