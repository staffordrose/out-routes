import { FC, KeyboardEvent, RefObject } from 'react';
import { BiTargetLock } from 'react-icons/bi';

import { Button } from '@/components/atoms';
import { LngLat } from '@/types/maps';
import { round } from '@/utils';

type CoordinatesProps = {
  inputEl: RefObject<HTMLInputElement>;
  coordinatesEl: RefObject<HTMLButtonElement>;
  coordinates: [number, number];
  handleFeatureClick: (lngLat: LngLat, properties?: { title?: string }) => void;
};

export const Coordinates: FC<CoordinatesProps> = ({
  inputEl,
  coordinatesEl,
  coordinates,
  handleFeatureClick,
}) => {
  const lng = round(coordinates[0], 6);
  const lat = round(coordinates[1], 6);

  return (
    <Button
      ref={coordinatesEl}
      type='button'
      variant='ghost'
      size='xs'
      onClick={() => handleFeatureClick([lng, lat])}
      onKeyDown={(e: KeyboardEvent<HTMLButtonElement>) => {
        if (e.code === 'ArrowUp' || e.code === 'ArrowDown') {
          e.preventDefault();

          if (e.code === 'ArrowUp' && inputEl.current) {
            inputEl.current.focus();
          }
        }
      }}
    >
      <BiTargetLock />
      <span>
        {lat}, {lng}
      </span>
    </Button>
  );
};
