import { FC } from 'react';

import {
  numberWithCommas,
  roundToDecimalCount,
  sqMetersToAcres,
} from '@/utils';

type AreaProps = {
  area?: number | null;
};

export const Area: FC<AreaProps> = ({ area }) => {
  if (typeof area !== 'number') return null;
  return (
    <span>
      {numberWithCommas(
        roundToDecimalCount(sqMetersToAcres(area), { decimalCount: 1 })
      )}{' '}
      acres
    </span>
  );
};
