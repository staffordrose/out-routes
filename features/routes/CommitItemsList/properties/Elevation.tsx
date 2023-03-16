import { FC } from 'react';

import { metersToFeet, numberWithCommas, round } from '@/utils';

type ElevationProps = {
  ele?: number | null;
};

export const Elevation: FC<ElevationProps> = ({ ele }) => {
  if (typeof ele !== 'number') return null;
  return <span>{numberWithCommas(round(metersToFeet(ele), 1))} ft.</span>;
};
