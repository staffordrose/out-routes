import { FC, memo } from 'react';

import { styled } from '@/styles';
import { metersToFeet, numberWithCommas } from '@/utils';

type MinMaxElevationsProps = {
  eleMax: number;
  eleMin: number | null;
};

const MinMaxElevationsComp: FC<MinMaxElevationsProps> = ({
  eleMax,
  eleMin,
}) => {
  return (
    <StyledMinMaxElevations>
      {eleMax > 0 && (
        <div>
          <p>{numberWithCommas(Math.round(metersToFeet(eleMax)))} ft.</p>
        </div>
      )}
      <div>
        <p>{numberWithCommas(Math.round(metersToFeet(eleMin || 0)))} ft.</p>
      </div>
    </StyledMinMaxElevations>
  );
};

export const MinMaxElevations = memo(MinMaxElevationsComp);

const StyledMinMaxElevations = styled('div', {
  userSelect: 'none',
  '& > div': {
    position: 'absolute',
    right: 0,
    display: 'flex',
    placeItems: 'center',
    overflow: 'hidden',
    minHeight: '$3_5',
    paddingX: '$0_5',
    borderWidth: '$1',
    borderStyle: 'solid',
    borderColor: 'transparent',
    borderRadius: '$sm',
    lineHeight: '$sm',
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '$full',
      height: '$full',
      backgroundColor: '$slate-50',
      opacity: 0.625,
    },
    '& > p': {
      position: 'relative',
      zIndex: 10,
      fontSize: '0.625rem',
    },
  },
  '& > :not(div:last-child)': {
    top: '$0_5',
  },
  '& > div:last-child': {
    bottom: '$0_5',
  },
});
