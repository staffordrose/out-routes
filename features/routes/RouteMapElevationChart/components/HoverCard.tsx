import { FC, memo, useMemo } from 'react';

import { MapFeature } from '@/types/maps';
import { styled } from '@/styles';
import { Text, TruncatedText } from '@/components/atoms';
import {
  kilometersToMiles,
  metersToFeet,
  numberWithCommas,
  round,
} from '@/utils';
import { getElevationsByPixel } from '../helpers';

type HoverCardProps = {
  containerWidth: number;
  cursorPx: number;
  isHovering: boolean;
  features: MapFeature[];
  kmTotal: number;
};

const HoverCardComp: FC<HoverCardProps> = ({
  containerWidth,
  cursorPx,
  isHovering,
  features,
  kmTotal,
}) => {
  const distances = useMemo(() => {
    const distances: { start: number; distance: number }[] = [];

    let kmAccum = 0;

    for (const index in features) {
      const feature = features[index];

      const distance = feature.properties.distance || 0;

      distances.push({
        start: kmAccum,
        distance: distance,
      });

      kmAccum += distance;
    }

    return distances;
  }, [features]);

  const elevations = useMemo(() => {
    return getElevationsByPixel(containerWidth, features);
  }, [containerWidth, features]);

  const { featureIndex, elevation, mileProgress } = useMemo(() => {
    const progress = cursorPx / containerWidth;
    const kmProgress = kmTotal * progress;

    let featureIndex = 0;

    for (const index in distances) {
      const { start, distance } = distances[index];

      if (
        kmProgress > start &&
        (kmProgress <= start + distance ||
          Number(index) === distances.length - 1)
      ) {
        featureIndex = Number(index);
        break;
      }
    }

    return {
      featureIndex,
      elevation: numberWithCommas(
        Math.round(metersToFeet(elevations[cursorPx]))
      ),
      mileProgress: round(kilometersToMiles(kmProgress), 2),
    };
  }, [containerWidth, cursorPx, distances, kmTotal, elevations]);

  const title = features[featureIndex || 0].properties.title;

  if (isHovering) {
    return (
      <>
        <VerticalIndicator style={{ left: cursorPx - 0.5 }} />
        <StyledHoverCard
          style={{
            left:
              cursorPx >= containerWidth - 96 - 4
                ? cursorPx + 0.5 - 96 - 4
                : cursorPx - 0.5 + 4,
          }}
        >
          <div>
            <TruncatedText lineClamp={1} fontSize='xs' fontWeight='medium'>
              {title || '[Untitled feature]'}
            </TruncatedText>
            <Text fontSize='xs'>{elevation} ft.</Text>
            <Text fontSize='xs'>{mileProgress} mi.</Text>
          </div>
        </StyledHoverCard>
      </>
    );
  }
  return null;
};

export const HoverCard = memo(HoverCardComp);

const VerticalIndicator = styled('div', {
  position: 'absolute',
  top: 0,
  width: '$px',
  height: '$full',
  backgroundColor: '$slate-400',
});

const StyledHoverCard = styled('div', {
  position: 'absolute',
  zIndex: 100,
  top: 0,
  width: '$24',
  height: '$full',
  paddingY: '$1',
  '& > div': {
    width: '$full',
    height: '$full',
    padding: '$1',
    borderWidth: '$1',
    borderStyle: 'solid',
    borderColor: '$slate-300',
    borderRadius: '$md',
    backgroundColor: '$white',
  },
});
