import { FC } from 'react';

import { kilometersToMiles, numberWithCommas, round } from '@/utils';

type DistanceProps = {
  distance?: number | null;
};

export const Distance: FC<DistanceProps> = ({ distance }) => {
  if (typeof distance !== 'number') return null;
  return (
    <span>{numberWithCommas(round(kilometersToMiles(distance), 1))} mi.</span>
  );
};
