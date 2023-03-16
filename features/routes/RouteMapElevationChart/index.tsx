import { FC, useMemo } from 'react';
import { Position } from 'geojson';
import flatten from 'lodash.flatten';

import { Text } from '@/components/atoms';
import { GeometryTypeNames } from '@/data/routes';
import { styled } from '@/styles';
import { MapFeature, MapLayer } from '@/types/maps';
import { getLineStringSegmentDistances, roundToDecimalCount } from '@/utils';

type RouteMapElevationChartProps = {
  mapLayers: MapLayer[];
};

export const RouteMapElevationChart: FC<RouteMapElevationChartProps> = ({
  mapLayers,
}) => {
  const { features, totalKm, eleMax, eleMin } = useMemo(() => {
    const isLineStringCb = (feature: MapFeature) =>
      feature.geometry.type === GeometryTypeNames.LineString;

    return mapLayers.reduce(
      (accum, layer) => {
        if (
          Array.isArray(layer.data.features) &&
          layer.data.features.some(isLineStringCb)
        ) {
          const features = layer.data.features.filter(isLineStringCb);

          const allEle = flatten(
            features.map((feature) =>
              (feature.geometry.coordinates as Position[])
                .map((position) => position[2])
                .filter((ele) => typeof ele === 'number' && !Number.isNaN(ele))
            )
          );

          const eleMax = Math.max.apply(null, allEle);
          const eleMin = Math.min.apply(null, allEle);

          accum.features = accum.features.concat(features);
          accum.totalKm += features.reduce(
            (accum, feature) => (
              (accum += feature.properties.distance || 0), accum
            ),
            0
          );
          accum.eleMax = Math.max(eleMax, accum.eleMax);
          accum.eleMin =
            accum.eleMin !== null ? Math.min(eleMin, accum.eleMin) : eleMin;
        }

        return accum;
      },
      { features: [], totalKm: 0, eleMax: 0, eleMin: null } as {
        features: MapFeature[];
        totalKm: number;
        eleMax: number;
        eleMin: number | null;
      }
    );
  }, [mapLayers]);

  const { featureSeparators, featurePaths } = useMemo(() => {
    const featureSeparators: { d: string }[] = [];
    const featurePaths: { d: string; color?: string }[] = [];

    let featureStartDist = 0;

    features.forEach(
      (
        { geometry: { coordinates }, properties: { layerColor, color } },
        featureIndex
      ) => {
        const distances = getLineStringSegmentDistances(
          coordinates as Position[]
        );

        const relativeDistances = distances.map((d, i) => {
          const r = d / totalKm;

          if (i === 0 || i === distances.length - 1) {
            // shorten first and last distance
            return r - 0.001;
          } else {
            return r;
          }
        });

        const featureDistance = relativeDistances.reduce(
          (sum, curr) => ((sum += curr), sum),
          0
        );

        const relativeElevations = (coordinates as Position[]).map(
          (position) => {
            if (
              typeof eleMin !== 'number' ||
              Number.isNaN(eleMin) ||
              eleMin === eleMax
            ) {
              // prevent relative elevation from reaching 0
              return 0.0125;
            }

            let ele = (position[2] - eleMin) / (eleMax - eleMin);

            // prevent relative elevation from reaching 0 or 100
            ele = Math.min(0.9875, ele);
            ele = Math.max(0.0125, ele);

            return ele;
          }
        );

        let d = '';
        let prevEle = null;

        for (const index in coordinates as Position[]) {
          let dist = 0;

          if (Number(index) > 0) {
            dist += relativeDistances[Number(index) - 1];
          }

          const ele = relativeElevations[index];

          const eleDiff = (prevEle || 0) - ele;

          prevEle = ele;

          let segment = '';

          if (Number(index) === 0) {
            const x = roundToDecimalCount(100 * (featureStartDist + 0.002), {
              decimalCount: 3,
            });
            const y = roundToDecimalCount(100 * (1 - ele), {
              decimalCount: 3,
            });
            segment = `M${x},${y} `;
          } else if (Number(index) === coordinates.length - 1) {
            const x = roundToDecimalCount(100 * (dist - 0.002), {
              decimalCount: 3,
            });
            const y = roundToDecimalCount(100 * eleDiff, {
              decimalCount: 3,
            });
            segment = `l${x},${y} `;
          } else {
            const x = roundToDecimalCount(100 * dist, {
              decimalCount: 3,
            });
            const y = roundToDecimalCount(100 * eleDiff, {
              decimalCount: 3,
            });
            segment = `l${x},${y} `;
          }

          d = d.concat(segment);
        }

        if (featureIndex > 0) {
          const x = roundToDecimalCount(100 * featureStartDist, {
            decimalCount: 3,
          });
          featureSeparators.push({ d: `M${x},0 V100` });
        }

        featureStartDist += featureDistance + 0.002;

        featurePaths.push({ d, color: color || layerColor });
      }
    );

    return { featureSeparators, featurePaths };
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
          <path
            d='M0.1,75 H99.9'
            strokeWidth={1}
            strokeLinecap='round'
            vectorEffect='non-scaling-stroke'
            fill='none'
          />
          <path
            d='M0.1,50 H99.9'
            strokeWidth={1}
            strokeLinecap='round'
            vectorEffect='non-scaling-stroke'
            fill='none'
          />
          <path
            d='M0.1,25 H99.9'
            strokeWidth={1}
            strokeLinecap='round'
            vectorEffect='non-scaling-stroke'
            fill='none'
          />
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
