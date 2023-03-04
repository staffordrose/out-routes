import { FC } from 'react';

import { styled } from '@/styles';
import { Route, RouteFeature, RouteLayer } from '@/types';
import { parseMapBounds } from '@/utils';
import { MapLayersFeatures } from './components';
import { useMap } from './hooks';

type RouteMapProps = {
  route: Route;
  layers: RouteLayer[];
  features: RouteFeature[];
};

export const RouteMap: FC<RouteMapProps> = ({ route, layers, features }) => {
  const { mapContainerEl, openPopup } = useMap({
    mapBounds: route.map_bounding_box
      ? parseMapBounds(route.map_bounding_box)
      : null,
    layers,
    features,
  });

  return (
    <StyledMap>
      <div ref={mapContainerEl} />
      <MapLayersFeatures
        layers={layers}
        features={features}
        openPopup={openPopup}
      />
    </StyledMap>
  );
};

const StyledMap = styled('div', {
  overflow: 'hidden',
  display: 'grid',
  width: '$full',
  borderWidth: '$1',
  borderStyle: 'solid',
  borderColor: '$slate-300',
  borderRadius: '$xl',
  '& > div:first-child': {
    width: '$full',
    height: 'calc(540px - ($borderWidths$1 + $borderWidths$1))',
    backgroundColor: '$slate-200',
  },
  '& > ul:last-child': {
    overflowY: 'auto',
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  '@md': {
    height: 540,
    gridTemplateColumns: '1fr $48',
  },
  '@lg': {
    gridTemplateColumns: '1fr $64',
  },
});
