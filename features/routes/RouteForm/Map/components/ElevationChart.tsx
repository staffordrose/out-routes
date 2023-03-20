import { LngLat } from '@/types/maps';
import { FC, useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import { RouteMapElevationChart } from '../../../RouteMapElevationChart';
import { mapLayerValuesToMapboxLayer, RouteFormValues } from '../../helpers';

type ElevationChartProps = {
  hideTrackMarker: () => void;
  setTrackMarker: (lngLat: LngLat) => void;
};

export const ElevationChart: FC<ElevationChartProps> = ({
  hideTrackMarker,
  setTrackMarker,
}) => {
  const { control } = useFormContext<RouteFormValues>();

  const layers = useWatch({
    control,
    name: 'layers',
  });

  const mapLayers = useMemo(() => {
    return layers.map((layer, layerOrder) =>
      mapLayerValuesToMapboxLayer(layerOrder, layer)
    );
  }, [layers]);

  return (
    <RouteMapElevationChart
      mapLayers={mapLayers}
      hideTrackMarker={hideTrackMarker}
      setTrackMarker={setTrackMarker}
    />
  );
};
