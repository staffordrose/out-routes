import { FC } from 'react';

import { Text } from '@/components/atoms';
import { styled } from '@/styles';
import { metersToFeet, numberWithCommas } from '@/utils';

type MinMaxElevationsProps = {
  eleMax: number;
  eleMin: number | null;
};

export const MinMaxElevations: FC<MinMaxElevationsProps> = ({
  eleMax,
  eleMin,
}) => {
  return (
    <StyledMinMaxElevations>
      {eleMax > 0 && (
        <div>
          <Text>{numberWithCommas(Math.round(metersToFeet(eleMax)))} ft.</Text>
        </div>
      )}
      <div>
        <Text>
          {numberWithCommas(Math.round(metersToFeet(eleMin || 0)))} ft.
        </Text>
      </div>
    </StyledMinMaxElevations>
  );
};

const StyledMinMaxElevations = styled('div', {
  '& > div': {
    position: 'absolute',
    right: '$1',
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
      backgroundColor: '$white',
      opacity: 0.85,
    },
    '& > p': {
      position: 'relative',
      zIndex: 10,
      fontSize: '0.625rem',
    },
  },
  '& > :not(div:last-child)': {
    top: 'calc($1 + $px)',
  },
  '& > div:last-child': {
    bottom: 'calc($5 + $px)',
  },
});
