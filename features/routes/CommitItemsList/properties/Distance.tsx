import { FC } from 'react';

import {
  kilometersToMiles,
  numberWithCommas,
  roundToDecimalCount,
} from '@/utils';

type DistanceProps = {
  distance?: number | null;
};

export const Distance: FC<DistanceProps> = ({ distance }) => {
  if (typeof distance !== 'number') return null;
  return (
    <span>
      {numberWithCommas(
        roundToDecimalCount(kilometersToMiles(distance), { decimalCount: 1 })
      )}{' '}
      mi.
    </span>
  );
};
