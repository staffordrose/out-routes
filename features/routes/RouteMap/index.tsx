import { FC, useMemo } from 'react';

import { styled } from '@/styles';
import { Route, RouteFeature, RouteLayer } from '@/types/routes';
import {
  mapLayerAndFeatureRecordsToMapboxLayer,
  parseMapBounds,
} from '@/utils';
import { RouteMapElevationChart } from '../RouteMapElevationChart';
import { MapLayersFeatures } from './components';
import { useMap } from './hooks';

type RouteMapProps = {
  route: Route;
  layers: RouteLayer[];
  features: RouteFeature[];
};

export const RouteMap: FC<RouteMapProps> = ({ route, layers, features }) => {
  const { mapContainerEl, map, openPopup, setTrackMarker, hideTrackMarker } =
    useMap({
      mapBounds: route.map_bounding_box
        ? parseMapBounds(route.map_bounding_box)
        : null,
      layers,
      features,
    });

  const mapLayers = useMemo(() => {
    return layers.map((layer) =>
      mapLayerAndFeatureRecordsToMapboxLayer(
        layer,
        features.filter((feature) => layer.id === feature.layer?.id)
      )
    );
  }, [layers, features]);

  return (
    <StyledMap>
      <div>
        <div id='map-container' ref={mapContainerEl} />
        <RouteMapElevationChart
          mapLayers={mapLayers}
          hideTrackMarker={hideTrackMarker}
          setTrackMarker={setTrackMarker}
        />
      </div>
      <MapLayersFeatures
        map={map}
        layers={layers}
        features={features}
        openPopup={openPopup}
      />
    </StyledMap>
  );
};

const StyledMap = styled('div', {
  boxSizing: 'border-box',
  position: 'relative',
  width: '$full',
  '& > div:first-child': {
    position: 'sticky',
    top: 'calc($14 + $4)',
    width: '$full',
    height: 'calc(100vh - $14 - $12 - $4 - $4 - $24)',
    borderWidth: '$1',
    borderStyle: 'solid',
    borderColor: '$slate-300',
    borderBottomWidth: 0,
    borderTopLeftRadius: '$xl',
    borderTopRightRadius: '$xl',
    overflow: 'hidden',
    '& > div#map-container': {
      width: '$full',
      height: 'calc($full - $18)',
      backgroundColor: '$slate-200',
    },
    '& > div:last-child': {
      height: '$18',
      borderTopWidth: '$1',
      borderTopStyle: 'solid',
      borderTopColor: '$slate-300',
    },
  },
  '& > div:last-child': {
    position: 'relative',
    zIndex: 10,
    overflow: 'auto',
    borderWidth: '$1',
    borderStyle: 'solid',
    borderColor: '$slate-300',
    borderBottomLeftRadius: '$xl',
    borderBottomRightRadius: '$xl',
  },
  '@md': {
    display: 'grid',
    gridTemplateColumns: '1fr $48',
    height: 'calc(100vh - $14 - $4 - $4 - $12)',
    '& > div:first-child': {
      height: '$full',
      borderBottomWidth: '$1',
      borderRightWidth: 0,
      borderTopRightRadius: 0,
      borderBottomLeftRadius: '$xl',
      '& > div#map-container': {
        height: 'calc($full - $24)',
      },
      '& > div:last-child': {
        height: '$24',
      },
    },
    '& > div:last-child': {
      overflowY: 'auto',
      borderWidth: '$1',
      borderStyle: 'solid',
      borderColor: '$slate-300',
      borderTopRightRadius: '$xl',
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: '$xl',
    },
  },
  '@lg': {
    gridTemplateColumns: '1fr $64',
  },
});
