import { FC } from 'react';
import { BiEditAlt, BiShapePolygon, BiShareAlt } from 'react-icons/bi';

import { IconButton, TruncatedText } from '@/components/atoms';
import { GeometryTypeNames, SymbolCodes, symbolIcons } from '@/data/routes';
import { styled } from '@/styles';
import { MapFeature } from '@/types/maps';
import { trimFeatureSymbolCode } from '@/utils';
import { LayerValues } from '../RouteForm/helpers';

export type HeaderProps = {
  feature: MapFeature;
};

export const Header: FC<HeaderProps> = ({ feature }) => {
  const { properties } = feature;

  return (
    <StyledHeader>
      <div>
        <SymbolIcon feature={feature} />
        <TruncatedText as='h5' lineClamp={2}>
          {properties.title || '[Untitled feature]'}
        </TruncatedText>
      </div>
    </StyledHeader>
  );
};

export type ActionHeaderProps = {
  layerIndex: number;
  layer: LayerValues;
  feature: MapFeature;
  openFeatureEditDialog: (
    layerIndex: number,
    layer: LayerValues,
    feature: MapFeature
  ) => void;
};

export const ActionHeader: FC<ActionHeaderProps> = ({
  layerIndex,
  layer,
  feature,
  openFeatureEditDialog,
}) => {
  const { properties } = feature;

  return (
    <StyledHeader>
      <div>
        <SymbolIcon feature={feature} />
        <TruncatedText as='h5' lineClamp={2}>
          {properties.title || '[Untitled feature]'}
        </TruncatedText>
      </div>
      <IconButton
        type='button'
        variant='ghost'
        size='xs'
        aria-label='Edit Feature'
        onClick={() => {
          openFeatureEditDialog(layerIndex, layer, feature);
        }}
      >
        <BiEditAlt />
      </IconButton>
    </StyledHeader>
  );
};

const StyledHeader = styled('div', {
  display: 'flex',
  gap: '$2',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: 'full',
  height: '$12',
  padding: '$2',
  borderBottomWidth: '$1',
  borderBottomStyle: 'solid',
  borderBottomColor: '$slate-300',
  backgroundColor: '$white',
  '& > div': {
    display: 'flex',
    gap: '$1',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '$full',
    minHeight: '$7',
    paddingY: '$1',
    '& > svg': {
      flexShrink: 0,
      width: '$6',
      height: '$6',
    },
  },
  '& > button': {
    flexShrink: 0,
  },
});

const SymbolIcon: FC<{ feature: MapFeature }> = ({ feature }) => {
  const { geometry, properties } = feature;

  const Icon =
    geometry.type === GeometryTypeNames.Polygon
      ? BiShapePolygon
      : geometry.type === GeometryTypeNames.LineString
      ? BiShareAlt
      : symbolIcons[
          (trimFeatureSymbolCode(properties.symbol) ||
            trimFeatureSymbolCode(properties.layerSymbol) ||
            SymbolCodes.Marker) as SymbolCodes
        ];

  return (
    <Icon
      style={{
        fill: properties.color || properties.layerColor || undefined,
      }}
    />
  );
};
