import { FC } from 'react';

import { numberWithCommas, round, sqMetersToAcres } from '@/utils';

type AreaProps = {
  area?: number | null;
};

export const Area: FC<AreaProps> = ({ area }) => {
  if (typeof area !== 'number') return null;
  return <span>{numberWithCommas(round(sqMetersToAcres(area), 1))} acres</span>;
};
