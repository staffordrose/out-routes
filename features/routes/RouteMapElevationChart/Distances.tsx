import { FC, useCallback, useMemo, useState } from 'react';

import { Text } from '@/components/atoms';
import { useWindowSize } from '@/hooks';
import { styled } from '@/styles';
import { getDistances } from './helpers';

type DistancesProps = {
  totalKm: number;
};

export const Distances: FC<DistancesProps> = ({ totalKm }) => {
  const windowSize = useWindowSize();

  const [containerWidth, setContainerWidth] = useState<number>(0);

  const ref = useCallback(
    (el: HTMLDivElement | null) => {
      if (windowSize.width && el) {
        const rect = el.getBoundingClientRect();
        setContainerWidth(rect.width);
      }
    },
    [windowSize.width]
  );

  const distances = useMemo(
    () => getDistances(containerWidth, totalKm),
    [containerWidth, totalKm]
  );

  return (
    <StyledDistances ref={ref}>
      {distances.map((distance, distanceIndex) => {
        return (
          <DistanceLabel
            key={distance}
            windowWidth={windowSize.width}
            containerWidth={containerWidth}
            distancesMax={distances[distances.length - 1]}
            distancesCount={distances.length}
            distanceIndex={distanceIndex}
            distance={distance}
          />
        );
      })}
    </StyledDistances>
  );
};

type DistanceLabelProps = {
  windowWidth: number | undefined;
  containerWidth: number;
  distancesMax: number;
  distancesCount: number;
  distanceIndex: number;
  distance: number;
};

const DistanceLabel: FC<DistanceLabelProps> = ({
  windowWidth,
  containerWidth,
  distancesMax,
  distancesCount: count,
  distanceIndex: index,
  distance,
}) => {
  const [width, setWidth] = useState<number>(0);

  const ref = useCallback(
    (el: HTMLDivElement | null) => {
      if (windowWidth && el) {
        const rect = el.getBoundingClientRect();
        setWidth(rect.width);
      }
    },
    [windowWidth]
  );

  const relativeWidth = width / containerWidth;

  const test = (distance / distancesMax) * relativeWidth;

  const distancePer = distance / distancesMax;

  const distancePerNew = distancePer - test;

  return (
    <>
      <div
        className='distance-line'
        style={{
          left:
            index < count - 1
              ? distancePer === 0
                ? 1
                : `${distancePer * 100}%`
              : 'auto',
          right: index === count - 1 ? 1 : 'auto',
        }}
      />
      <div
        ref={ref}
        className='distance'
        style={{
          left: index < count - 1 ? `${distancePerNew * 100}%` : 'auto',
          right: index === count - 1 ? 0 : 'auto',
        }}
      >
        <Text>{distance} mi.</Text>
      </div>
    </>
  );
};

const StyledDistances = styled('div', {
  position: 'relative',
  width: '$full',
  '& > div.distance': {
    position: 'absolute',
    top: '$0_5',
    overflow: 'hidden',
    paddingX: '$0_5',
    borderRadius: '$sm',
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '$full',
      height: '$full',
      backgroundColor: '$orange-200',
    },
    '& > p': {
      position: 'relative',
      zIndex: 10,
      fontSize: '0.625rem',
    },
  },
  '& > div.distance-line': {
    position: 'absolute',
    top: 0,
    width: '$px',
    height: '$1',
    backgroundColor: '$orange-500',
  },
});
