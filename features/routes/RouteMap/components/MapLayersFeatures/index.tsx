import { FC, MutableRefObject } from 'react';
import type { Map } from 'mapbox-gl';

import { List } from '@/components/atoms';
import { styled } from '@/styles';
import { PopupState } from '@/types/maps';
import { Route, RouteFeature, RouteLayer } from '@/types/routes';
import { Header } from './Header';
import { Layer } from './Layer';

type MapLayersFeaturesProps = {
  map: MutableRefObject<Map | undefined>;
  route: Route;
  layers: RouteLayer[];
  features: RouteFeature[];
  openPopup: (popupState: PopupState) => void;
};

export const MapLayersFeatures: FC<MapLayersFeaturesProps> = ({
  map,
  route,
  layers,
  features,
  openPopup,
}) => {
  return (
    <StyledMapLayersFeatures>
      <Header route={route} layers={layers} features={features} />
      <List as='ul' direction='column' width='full'>
        {Array.isArray(layers) &&
          layers.length > 0 &&
          layers.map((layer) => {
            return (
              <Layer
                key={layer.id}
                map={map}
                layer={layer}
                features={
                  Array.isArray(features)
                    ? features.filter(
                        (feature) =>
                          feature.layer?.id && feature.layer.id === layer.id
                      )
                    : []
                }
                openPopup={openPopup}
              />
            );
          })}
      </List>
    </StyledMapLayersFeatures>
  );
};

const StyledMapLayersFeatures = styled('div', {
  width: '$full',
  borderTopWidth: '$1',
  borderTopStyle: 'solid',
  borderTopColor: '$slate-300',
  backgroundColor: '$white',
  '& > ul > li:not(:last-child) > div': {
    borderBottomWidth: '$1',
    borderBottomStyle: 'solid',
    borderBottomColor: '$slate-300',
  },
  '& > ul': {
    paddingBottom: '$12',
  },
  '@md': {
    borderTop: 'none',
  },
});
