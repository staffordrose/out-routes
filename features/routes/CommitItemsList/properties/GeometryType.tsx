import { FC } from 'react';

import { geometryTypeLabels, GeometryTypes } from '@/data/routes';

type GeometryTypeProps = {
  type?: string | null;
};

export const GeometryType: FC<GeometryTypeProps> = ({ type }) => {
  if (!type) return null;
  return <span>{geometryTypeLabels[type as GeometryTypes]}</span>;
};
