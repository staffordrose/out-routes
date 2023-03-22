import { FC, MutableRefObject } from 'react';
import type { Map } from 'mapbox-gl';

import { TruncatedText } from '@/components/atoms';
import { colorCodes, ColorNames } from '@/data/general';
import { SymbolCodes, symbolIcons } from '@/data/routes';
import { styled } from '@/styles';
import { PopupState } from '@/types/maps';
import { RouteFeature, RouteLayer } from '@/types/routes';
import { LayerFeatures } from './LayerFeatures';

type LayerProps = {
  map: MutableRefObject<Map | undefined>;
  layer: RouteLayer;
  features: RouteFeature[];
  openPopup: (popupState: PopupState) => void;
};

export const Layer: FC<LayerProps> = ({ map, layer, features, openPopup }) => {
  const { title, color, symbol } = layer;

  const SymbolIcon = symbolIcons[(symbol || SymbolCodes.Marker) as SymbolCodes];

  return (
    <StyledLayer>
      <StyledLayerDetails>
        <SymbolIcon
          style={{
            fill: color ? colorCodes[color as ColorNames] : undefined,
          }}
        />
        <TruncatedText as='h4'>{title || '[Untitled section]'}</TruncatedText>
      </StyledLayerDetails>
      <LayerFeatures
        map={map}
        layer={layer}
        features={features}
        openPopup={openPopup}
      />
    </StyledLayer>
  );
};

const StyledLayer = styled('li', {
  position: 'relative',
  width: '$full',
});

const StyledLayerDetails = styled('div', {
  position: 'sticky',
  zIndex: 10,
  top: 0,
  display: 'flex',
  gap: '$1',
  alignItems: 'center',
  minHeight: '$12',
  paddingLeft: '$3_5',
  paddingRight: '$2',
  borderBottomWidth: '$1',
  borderBottomStyle: 'solid',
  borderBottomColor: '$slate-300',
  backgroundColor: '$white',
  '& > svg': {
    flexShrink: 0,
    width: '$7',
    height: '$7',
  },
});
