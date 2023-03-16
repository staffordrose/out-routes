import { FC, MutableRefObject } from 'react';
import type { Map } from 'mapbox-gl';

import { List } from '@/components/atoms';
import { styled } from '@/styles';
import { PopupState } from '@/types/maps';
import { RouteFeature, RouteLayer } from '@/types/routes';
import { Layer } from './Layer';

type MapLayersFeaturesProps = {
  map: MutableRefObject<Map | undefined>;
  layers: RouteLayer[];
  features: RouteFeature[];
  openPopup: (popupState: PopupState) => void;
};

export const MapLayersFeatures: FC<MapLayersFeaturesProps> = ({
  map,
  layers,
  features,
  openPopup,
}) => {
  return (
    <StyledMapLayersFeatures>
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
  '@md': {
    borderTop: 'none',
  },
});
