import { FC, MutableRefObject } from 'react';
import type { Map } from 'mapbox-gl';

import { TruncatedText } from '@/components/atoms';
import { SymbolCodes, symbolIcons } from '@/data/routes';
import { styled } from '@/styles';
import { PopupState, RouteFeature, RouteLayer } from '@/types';
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
    <li>
      <StyledLayerDetails>
        <SymbolIcon
          style={{
            fill: color || undefined,
          }}
        />
        <TruncatedText as='h4' lineClamp={1}>
          {title || '[Untitled section]'}
        </TruncatedText>
      </StyledLayerDetails>
      <LayerFeatures
        map={map}
        layer={layer}
        features={features}
        openPopup={openPopup}
      />
    </li>
  );
};

const StyledLayerDetails = styled('div', {
  display: 'flex',
  gap: '$1',
  alignItems: 'center',
  minHeight: '$12',
  paddingLeft: '$3_5',
  paddingRight: '$2',
  borderBottomWidth: '$1',
  borderBottomStyle: 'solid',
  borderBottomColor: '$slate-300',
  '& > svg': {
    flexShrink: 0,
    width: '$7',
    height: '$7',
  },
});
