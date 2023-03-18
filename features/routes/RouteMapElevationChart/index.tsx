import { FC, useMemo } from 'react';

import { styled } from '@/styles';
import { MapLayer } from '@/types/maps';
import { Chart, Distances, MinMaxElevations } from './components';
import { getAggregatedStatsFromMapLayers } from './helpers';

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

  return (
    <StyledElevationsChart>
      <Chart
        features={features}
        totalKm={totalKm}
        eleMax={eleMax}
        eleMin={eleMin}
      />
      <MinMaxElevations eleMax={eleMax} eleMin={eleMin} />
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
});
