import { FC, useCallback, useMemo, useState } from 'react';

import { useWindowSize } from '@/hooks';
import { styled } from '@/styles';
import { LngLat, MapLayer } from '@/types/maps';
import { Chart, Distances, HoverCard, MinMaxElevations } from './components';
import {
  getAggregatedStatsFromMapLayers,
  getLngLatAtCursorPx,
} from './helpers';

type RouteMapElevationChartProps = {
  mapLayers: MapLayer[];
  hideTrackMarker?: () => void;
  setTrackMarker?: (lngLat: LngLat) => void;
};

export const RouteMapElevationChart: FC<RouteMapElevationChartProps> = ({
  mapLayers,
  hideTrackMarker,
  setTrackMarker,
}) => {
  const { features, kmTotal, eleMax, eleMin } = useMemo(
    () => getAggregatedStatsFromMapLayers(mapLayers),
    [mapLayers]
  );

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

  const [isHovering, setHovering] = useState(false);
  const [cursorPx, setCursorPx] = useState<number>(0);

  return (
    <StyledRouteMapElevationChart>
      <div
        ref={ref}
        onMouseEnter={() => {
          setHovering(true);
        }}
        onMouseMove={(e) => {
          const { clientX, currentTarget } = e;

          const { width, x } = currentTarget.getBoundingClientRect();

          const nextCursorPx = clientX + 1 - x;

          if (
            typeof nextCursorPx === 'number' &&
            !Number.isNaN(nextCursorPx) &&
            nextCursorPx >= 0 &&
            nextCursorPx <= width
          ) {
            setCursorPx(nextCursorPx);

            if (typeof setTrackMarker === 'function') {
              const lngLat = getLngLatAtCursorPx(
                containerWidth,
                nextCursorPx,
                features
              );

              if (lngLat) setTrackMarker(lngLat);
            }
          }
        }}
        onMouseLeave={() => {
          setHovering(false);

          if (typeof hideTrackMarker === 'function') {
            hideTrackMarker();
          }
        }}
      >
        <Chart
          features={features}
          kmTotal={kmTotal}
          eleMax={eleMax}
          eleMin={eleMin}
        />
        <MinMaxElevations eleMax={eleMax} eleMin={eleMin} />
        <Distances
          windowWidth={windowSize.width}
          containerWidth={containerWidth}
          kmTotal={kmTotal}
        />
        <HoverCard
          containerWidth={containerWidth}
          cursorPx={cursorPx}
          isHovering={isHovering}
          features={features}
          kmTotal={kmTotal}
        />
      </div>
    </StyledRouteMapElevationChart>
  );
};

const StyledRouteMapElevationChart = styled('div', {
  width: 'width',
  height: 'width',
  padding: '$1',
  paddingBottom: 'calc($4_5 + $px)',
  backgroundColor: '$slate-50',
  '& > div': {
    position: 'relative',
    width: '$full',
    height: '$full',
  },
});
