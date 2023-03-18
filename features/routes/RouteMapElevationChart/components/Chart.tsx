import { FC, useMemo } from 'react';

import { styled } from '@/styles';
import { MapFeature } from '@/types/maps';
import { getSVGPaths } from '../helpers';

type ChartProps = {
  features: MapFeature[];
  totalKm: number;
  eleMax: number;
  eleMin: number | null;
};

export const Chart: FC<ChartProps> = ({
  features,
  totalKm,
  eleMax,
  eleMin,
}) => {
  const { featureSeparators, featurePaths } = useMemo(
    () => getSVGPaths(features, totalKm, eleMax, eleMin || 0),
    [features, totalKm, eleMax, eleMin]
  );

  return (
    <StyledChart
      xmlns='http://www.w3.org/2000/svg'
      version='1.1'
      width='100%'
      height='100%'
      viewBox='0 0 100 100'
      preserveAspectRatio='none'
    >
      <g className='quadrants'>
        {[0.5, 25, 50, 75, 99.5].map((percent) => {
          return (
            <path
              key={percent}
              d={`M0.1,${percent} H99.9`}
              strokeDasharray={[25, 50, 75].includes(percent) ? 2 : 0}
            />
          );
        })}
      </g>
      <g className='separators'>
        {Array.isArray(featureSeparators) &&
          featureSeparators.length > 0 &&
          featureSeparators.map(({ d }, index) => {
            return <path key={index} d={d} />;
          })}
      </g>
      <g className='features'>
        {Array.isArray(featurePaths) &&
          featurePaths.length > 0 &&
          featurePaths.map(({ d, color }, index) => {
            return <path key={index} d={d} stroke={color} />;
          })}
      </g>
    </StyledChart>
  );
};

const StyledChart = styled('svg', {
  '& > g.quadrants': {
    '& > path': {
      stroke: '$slate-200',
      strokeWidth: 1,
      strokeLinecap: 'round',
      vectorEffect: 'non-scaling-stroke',
      fill: 'none',
    },
    '& > path:first-child, & > path:last-child': {
      stroke: '$slate-300',
    },
  },
  '& > g.separators > path': {
    stroke: '$slate-300',
    strokeWidth: 1,
    strokeDasharray: 2,
    vectorEffect: 'non-scaling-stroke',
    fill: 'none',
  },
  '& > g.features > path': {
    strokeWidth: 2,
    strokeLinecap: 'round',
    vectorEffect: 'non-scaling-stroke',
    fill: 'none',
  },
});
