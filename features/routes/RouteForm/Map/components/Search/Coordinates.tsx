import { FC } from 'react';
import { BiTargetLock } from 'react-icons/bi';

import { Button } from '@/components/atoms';
import { LngLat } from '@/types';
import { roundToDecimalCount } from '@/utils';

type CoordinatesProps = {
  coordinates: [number, number];
  handleFeatureClick: (lngLat: LngLat, properties?: { title?: string }) => void;
};

export const Coordinates: FC<CoordinatesProps> = ({
  coordinates,
  handleFeatureClick,
}) => {
  const lng = roundToDecimalCount(coordinates[0], {
    decimalCount: 6,
  });
  const lat = roundToDecimalCount(coordinates[1], {
    decimalCount: 6,
  });

  return (
    <Button
      variant='ghost'
      size='xs'
      onClick={() => handleFeatureClick([lng, lat])}
    >
      <BiTargetLock />
      <span>
        {lat}, {lng}
      </span>
    </Button>
  );
};
