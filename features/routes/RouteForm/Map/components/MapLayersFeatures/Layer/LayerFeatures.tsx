import { FC } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { BiShapePolygon, BiShareAlt } from 'react-icons/bi';

import { Box, Button } from '@/components/atoms';
import { Feedback } from '@/components/layout';
import { GeometryTypes, SymbolCodes, symbolIcons } from '@/data/routes';
import { styled } from '@/styles';
import { PopupState } from '@/types';
import { getFeatureLngLat } from '@/utils';
import {
  FeatureValues,
  LayerValues,
  mapFeatureValuesToMapFeature,
  RouteFormValues,
} from '../../../../helpers';

type LayerFeaturesProps = {
  layerIndex: number;
  openPopup: (popupState: PopupState) => void;
};

export const LayerFeatures: FC<LayerFeaturesProps> = ({
  layerIndex,
  openPopup,
}) => {
  const { control } = useFormContext<RouteFormValues>();

  const layer = useWatch({
    control,
    name: `layers.${layerIndex}`,
  });

  const features = useWatch({
    control,
    name: `layers.${layerIndex}.features`,
  });

  const { color, symbol } = layer;

  if (!Array.isArray(features) || !features.length) {
    return (
      <Box css={{ paddingLeft: '$1_5' }}>
        <Feedback
          size='xs'
          type='empty'
          icon={BiShapePolygon}
          title='No Features'
        >
          This section does not have any features.
        </Feedback>
      </Box>
    );
  }

  return (
    <StyledLayerFeatures>
      {features.map((feature, featureOrder) => {
        const mapFeature = mapFeatureValuesToMapFeature(
          {
            id: layer.databaseId as string,
            color,
            symbol,
          },
          featureOrder,
          feature
        );

        return (
          <FeatureButton
            key={feature.databaseId}
            layer={{
              color,
              symbol,
            }}
            feature={feature}
            onClick={() =>
              openPopup({
                center: getFeatureLngLat(mapFeature),
                feature: mapFeature,
              })
            }
          />
        );
      })}
    </StyledLayerFeatures>
  );
};

const StyledLayerFeatures = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax($56, 1fr))',
  width: '$full',
  padding: '$2',
  paddingLeft: '$3_5',
  '& > button': {
    justifyContent: 'flex-start',
    width: '$full',
  },
  '@md': {
    gridTemplateColumns: '1fr',
  },
});

type FeatureButtonProps = {
  layer: Pick<LayerValues, 'color' | 'symbol'>;
  feature: FeatureValues;
  onClick: () => void;
};

const FeatureButton: FC<FeatureButtonProps> = ({
  layer,
  feature: { type, title, color, symbol },
  onClick,
}) => {
  const SymbolIcon =
    type === GeometryTypes.LineString
      ? BiShareAlt
      : type === GeometryTypes.Polygon
      ? BiShapePolygon
      : symbolIcons[
          (symbol || layer.symbol || SymbolCodes.Marker) as SymbolCodes
        ];

  return (
    <Button
      type='button' // prevent form submission
      variant='ghost'
      size='xs'
      onClick={onClick}
    >
      <SymbolIcon
        style={{
          fill: color || layer.color || undefined,
        }}
      />
      <span>{title || '[Untitled feature]'}</span>
    </Button>
  );
};
