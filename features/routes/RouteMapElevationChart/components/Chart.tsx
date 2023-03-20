import { FC, memo, useMemo } from 'react';

import { styled } from '@/styles';
import { MapFeature } from '@/types/maps';
import { getSVGPaths } from '../helpers';

type ChartProps = {
  features: MapFeature[];
  kmTotal: number;
  eleMax: number;
  eleMin: number | null;
};

const ChartComp: FC<ChartProps> = ({ features, kmTotal, eleMax, eleMin }) => {
  const { featureSeparators, featurePaths } = useMemo(
    () => getSVGPaths(features, kmTotal, eleMax, eleMin || 0),
    [features, kmTotal, eleMax, eleMin]
  );

  return (
    <StyledChart
      xmlns='http://www.w3.org/2000/svg'
      version='1.1'
      width='100%'
      height='100%'
      viewBox='-0.01 -2 100.02 104'
      preserveAspectRatio='none'
    >
      <g className='quadrants'>
        {[-1.5, 25, 50, 75, 101.5].map((percent) => {
          return (
            <path
              key={percent}
              d={`M0,${percent} H100`}
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

export const Chart = memo(ChartComp);

const StyledChart = styled('svg', {
  '& > g.quadrants': {
    '& > path': {
      stroke: '$slate-200',
      strokeWidth: 1,
      strokeLinecap: 'butt',
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
    strokeLinecap: 'butt',
    strokeDasharray: 2,
    vectorEffect: 'non-scaling-stroke',
    fill: 'none',
  },
  '& > g.features > path': {
    strokeWidth: 2,
    strokeLinecap: 'butt',
    vectorEffect: 'non-scaling-stroke',
    fill: 'none',
  },
});
