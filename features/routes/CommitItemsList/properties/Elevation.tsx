import { FC } from 'react';

import { metersToFeet, numberWithCommas, roundToDecimalCount } from '@/utils';

type ElevationProps = {
  ele?: number | null;
};

export const Elevation: FC<ElevationProps> = ({ ele }) => {
  if (typeof ele !== 'number') return null;
  return (
    <span>
      {numberWithCommas(
        roundToDecimalCount(metersToFeet(ele), { decimalCount: 1 })
      )}{' '}
      ft.
    </span>
  );
};
