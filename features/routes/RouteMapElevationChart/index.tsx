import { FC, useMemo } from 'react';

import { Text } from '@/components/atoms';
import { styled } from '@/styles';
import { MapLayer } from '@/types/maps';
import { metersToFeet, numberWithCommas } from '@/utils';
import { Distances } from './Distances';
import { getAggregatedStatsFromMapLayers, getSVGPaths } from './helpers';

type RouteMapElevationChartProps = {
  mapLayers: MapLayer[];
};

export const RouteMapElevationChart: FC<RouteMapElevationChartProps> = ({
  mapLayers,
}) => {
  const { features, totalKm, eleMax, eleMin } = useMemo(
    () => getAggregatedStatsFromMapLayers(mapLayers),
    [mapLayers]
  );

  const { featureSeparators, featurePaths } = useMemo(
    () => getSVGPaths(features, totalKm, eleMax, eleMin || 0),
    [features, totalKm, eleMax, eleMin]
  );

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
      </svg>
      {eleMax > 0 && (
        <div className='max-ele'>
          <Text>{numberWithCommas(Math.round(metersToFeet(eleMax)))} ft.</Text>
        </div>
      )}
      <div className='min-ele'>
        <Text>
          {numberWithCommas(Math.round(metersToFeet(eleMin || 0)))} ft.
        </Text>
      </div>
      <Distances totalKm={totalKm} />
    </StyledElevationsChart>
  );
};

const StyledElevationsChart = styled('div', {
  position: 'relative',
  width: '$full',
  padding: '$1',
  paddingBottom: 'calc($4_5 + $px)',
  backgroundColor: '$slate-50',
  '& > svg': {
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
      backgroundColor: '$white',
      opacity: 0.85,
    },
    '& > p': {
      position: 'relative',
      zIndex: 10,
      fontSize: '0.625rem',
    },
  },
  '& > div.max-ele': {
    top: 'calc($1 + $px)',
  },
  '& > div.min-ele': {
    bottom: 'calc($5 + $px)',
  },
});
