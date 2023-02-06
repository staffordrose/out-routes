import { FC } from 'react';
import { BiShapePolygon, BiShareAlt } from 'react-icons/bi';

import { Button } from '@/components/atoms';
import { Feedback } from '@/components/layout';
import { GeometryTypes, SymbolCodes, symbolIcons } from '@/data/routes';
import { styled } from '@/styles';
import { PopupState, RouteFeature, RouteLayer } from '@/types';
import { getFeatureLngLat, mapFeatureRecordToMapFeature } from '@/utils';

type LayerFeaturesProps = {
  layer: RouteLayer;
  features: RouteFeature[];
  openPopup: (popupState: PopupState) => void;
};

export const LayerFeatures: FC<LayerFeaturesProps> = ({
  layer,
  features,
  openPopup,
}) => {
  const { color, symbol } = layer;

  if (!Array.isArray(features) || !features.length) {
    return (
      <Feedback
        size='xs'
        type='empty'
        icon={BiShapePolygon}
        title='No Features'
      >
        This layer does not have any features.
      </Feedback>
    );
  }
  return (
    <StyledLayerFeatures>
      {features.map((feature) => {
        const mapFeature = mapFeatureRecordToMapFeature(layer, feature);

        return (
          <FeatureButton
            key={feature.id}
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

type FeatureButtonProps = {
  layer: Pick<RouteLayer, 'color' | 'symbol'>;
  feature: RouteFeature;
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
    <Button variant='ghost' size='xs' onClick={onClick}>
      <SymbolIcon
        style={{
          fill: color || layer.color || undefined,
        }}
      />
      <span>{title || '[Untitled feature]'}</span>
    </Button>
  );
};

const StyledLayerFeatures = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax($56, 1fr))',
  width: '$full',
  padding: '$2',
  '& > button': {
    justifyContent: 'flex-start',
    width: '$full',
  },
  '@md': {
    gridTemplateColumns: '1fr',
  },
});
