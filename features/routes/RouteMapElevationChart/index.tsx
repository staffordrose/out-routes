import { FC, useMemo } from 'react';

import { Text } from '@/components/atoms';
import { styled } from '@/styles';
import { MapLayer } from '@/types/maps';
import { getAggregatedStatsFromMapLayers, getSVGPaths } from './helpers';

type RouteMapElevationChartProps = {
  mapLayers: MapLayer[];
};

export const RouteMapElevationChart: FC<RouteMapElevationChartProps> = ({
  mapLayers,
}) => {
  const { features, totalKm, eleMax, eleMin } = useMemo(() => {
    return getAggregatedStatsFromMapLayers(mapLayers);
  }, [mapLayers]);

  const { featureSeparators, featurePaths } = useMemo(() => {
    return getSVGPaths(features, totalKm, eleMax, eleMin || 0);
  }, [features, totalKm, eleMax, eleMin]);

  return (
    <StyledElevationsChart>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        version='1.1'
        width='100%'
        height='100%'
        viewBox='0 0 100 100'
        preserveAspectRatio='none'
      >
        <g className='quadrants'>
          {[25, 50, 75].map((percent) => {
            return (
              <path
                key={percent}
                d={`M0.1,${percent} H99.9`}
                strokeWidth={1}
                strokeLinecap='round'
                vectorEffect='non-scaling-stroke'
                fill='none'
              />
            );
          })}
        </g>
        <g className='separators'>
          {Array.isArray(featureSeparators) &&
            featureSeparators.length > 0 &&
            featureSeparators.map(({ d }, index) => {
              return (
                <path
                  key={index}
                  d={d}
                  strokeWidth={2}
                  vectorEffect='non-scaling-stroke'
                  fill='none'
                />
              );
            })}
        </g>
        <g>
          {Array.isArray(featurePaths) &&
            featurePaths.length > 0 &&
            featurePaths.map(({ d, color }, index) => {
              return (
                <path
                  key={index}
                  d={d}
                  stroke={color}
                  strokeWidth={2}
                  strokeLinecap='round'
                  vectorEffect='non-scaling-stroke'
                  fill='none'
                />
              );
            })}
        </g>
      </svg>
      <div className='max-ele'>
        <Text fontSize='xs'>{Math.round(eleMax)} ft.</Text>
      </div>
      <div className='min-ele'>
        <Text fontSize='xs'>{Math.round(eleMin || 0)} ft.</Text>
      </div>
    </StyledElevationsChart>
  );
};

const StyledElevationsChart = styled('div', {
  position: 'relative',
  width: '$full',
  padding: '$1',
  backgroundColor: '$slate-50',
  '& > svg': {
    '& > g.quadrants > path': {
      stroke: '$slate-200',
    },
    '& > g.separators > path': {
      stroke: '$slate-300',
    },
  },
  '& > div.max-ele, & > div.min-ele': {
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
      backgroundColor: '$slate-300',
      opacity: 0.75,
    },
    '& > p': {
      position: 'relative',
      zIndex: 10,
    },
  },
  '& > div.max-ele': {
    top: '$1',
  },
  '& > div.min-ele': {
    bottom: '$1',
  },
});
