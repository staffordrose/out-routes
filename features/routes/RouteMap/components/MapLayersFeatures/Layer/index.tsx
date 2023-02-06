import { FC } from 'react';

import { TruncatedText } from '@/components/atoms';
import { SymbolCodes, symbolIcons } from '@/data/routes';
import { styled } from '@/styles';
import { PopupState, RouteFeature, RouteLayer } from '@/types';
import { LayerFeatures } from './LayerFeatures';

type LayerProps = {
  layer: RouteLayer;
  features: RouteFeature[];
  openPopup: (popupState: PopupState) => void;
};

export const Layer: FC<LayerProps> = ({ layer, features, openPopup }) => {
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
        <TruncatedText as='h3' lineClamp={1}>
          {title || '[Untitled layer]'}
        </TruncatedText>
      </StyledLayerDetails>
      <LayerFeatures layer={layer} features={features} openPopup={openPopup} />
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
  borderBottomColor: '$slate-200',
  '& > svg': {
    flexShrink: 0,
    width: '$7',
    height: '$7',
  },
});
