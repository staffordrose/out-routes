import { FC, memo, useCallback, useMemo, useState } from 'react';

import { Text } from '@/components/atoms';
import { styled } from '@/styles';
import { getDistances } from '../helpers';

type DistancesProps = {
  windowWidth?: number;
  containerWidth: number;
  kmTotal: number;
};

const DistancesComp: FC<DistancesProps> = ({
  windowWidth,
  containerWidth,
  kmTotal,
}) => {
  const distances = useMemo(
    () => getDistances(containerWidth, kmTotal),
    [containerWidth, kmTotal]
  );

  return (
    <StyledDistances>
      {distances.map((distance, distanceIndex) => {
        return (
          <DistanceLabel
            key={distance}
            windowWidth={windowWidth}
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

export const Distances = memo(DistancesComp);

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

  // element width as a percent of containing div
  const relativeWidth = width / containerWidth;

  // distance as a percent of total distance
  const relativeDistance = distance / distancesMax;

  /**
   * offset starting point of distance label to even
   * out space between labels
   */
  const relativeDistanceAdjusted =
    relativeDistance - relativeDistance * relativeWidth;

  return (
    <>
      <div
        className='distance-line'
        style={{
          left: index < count - 1 ? `${relativeDistance * 100}%` : 'auto',
          right: index === count - 1 ? '0%' : 'auto',
        }}
      />
      <div
        ref={ref}
        className='distance'
        style={{
          left:
            index < count - 1 ? `${relativeDistanceAdjusted * 100}%` : 'auto',
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
  userSelect: 'none',
  '& > div.distance': {
    position: 'absolute',
    top: '$0_5',
    display: 'flex',
    placeItems: 'center',
    overflow: 'hidden',
    minHeight: '$3_5',
    paddingX: '$0_5',
    borderWidth: '$1',
    borderStyle: 'solid',
    borderColor: '$slate-300',
    borderRadius: '$sm',
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '$full',
      height: '$full',
      backgroundColor: '$slate-100',
    },
    '& > p': {
      position: 'relative',
      zIndex: 10,
      fontSize: '0.625rem',
      lineHeight: '$xs',
    },
  },
  '& > div.distance-line': {
    position: 'absolute',
    top: 0,
    width: '$px',
    height: '$1',
    backgroundColor: '$slate-300',
  },
});
