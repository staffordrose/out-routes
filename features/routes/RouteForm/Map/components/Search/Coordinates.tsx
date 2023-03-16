import { FC } from 'react';
import { BiTargetLock } from 'react-icons/bi';

import { Button } from '@/components/atoms';
import { LngLat } from '@/types/maps';
import { round } from '@/utils';

type CoordinatesProps = {
  coordinates: [number, number];
  handleFeatureClick: (lngLat: LngLat, properties?: { title?: string }) => void;
};

export const Coordinates: FC<CoordinatesProps> = ({
  coordinates,
  handleFeatureClick,
}) => {
  const lng = round(coordinates[0], 6);
  const lat = round(coordinates[1], 6);

  return (
    <Button
      type='button'
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
