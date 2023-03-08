import { FC, useRef } from 'react';
import { UseFieldArrayUpdate, useFormContext, useWatch } from 'react-hook-form';
import { BiShapePolygon } from 'react-icons/bi';

import { Box } from '@/components/atoms';
import { Feedback } from '@/components/layout';
import { styled } from '@/styles';
import { MapFeature, PopupState } from '@/types';
import { LayerValues, RouteFormValues } from '../../../../../helpers';
import { Feature } from './Feature';

type LayerFeaturesProps = {
  update: UseFieldArrayUpdate<RouteFormValues, 'layers'>;
  layerIndex: number;
  openPopup: (popupState: PopupState) => void;
  closePopup: () => void;
  openFeatureEditDialog: (
    layerIndex: number,
    layer: LayerValues,
    feature: MapFeature
  ) => void;
  isLayerFeaturesReordering: boolean;
};

export const LayerFeatures: FC<LayerFeaturesProps> = ({
  update,
  layerIndex,
  openPopup,
  closePopup,
  openFeatureEditDialog,
  isLayerFeaturesReordering,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeIndicatorRef = useRef<HTMLDivElement>(null);

  const showActiveIndicator = (y: number) => {
    if (activeIndicatorRef.current) {
      activeIndicatorRef.current.style.top = `${y}px`;
      activeIndicatorRef.current.style.opacity = '1';
    }
  };
  const hideActiveIndicator = () => {
    if (activeIndicatorRef.current) {
      activeIndicatorRef.current.style.top = '0px';
      activeIndicatorRef.current.style.opacity = '0';
    }
  };

  const { control } = useFormContext<RouteFormValues>();

  const layer = useWatch({
    control,
    name: `layers.${layerIndex}`,
  });

  if (!Array.isArray(layer.features) || !layer.features.length) {
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
    <StyledLayerFeatures ref={containerRef}>
      <ActiveIndicator ref={activeIndicatorRef} />
      {layer.features.map((feature, featureOrder) => {
        return (
          <Feature
            key={feature.databaseId}
            update={update}
            layerIndex={layerIndex}
            layer={layer}
            containerRef={containerRef}
            showActiveIndicator={showActiveIndicator}
            hideActiveIndicator={hideActiveIndicator}
            featureOrder={featureOrder}
            featuresLength={layer.features?.length || 0}
            feature={feature}
            openPopup={openPopup}
            closePopup={closePopup}
            openFeatureEditDialog={openFeatureEditDialog}
            isLayerFeaturesReordering={isLayerFeaturesReordering}
          />
        );
      })}
    </StyledLayerFeatures>
  );
};

const StyledLayerFeatures = styled('div', {
  position: 'relative',
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax($56, 1fr))',
  width: '$full',
  marginY: '$2',
  paddingLeft: '$3_5',
  paddingRight: '$2',
  '& > button': {
    justifyContent: 'flex-start',
    width: '$full',
  },
  '@md': {
    gridTemplateColumns: '1fr',
  },
});

const ActiveIndicator = styled('div', {
  position: 'absolute',
  zIndex: 10,
  top: 0,
  width: 'calc(100% - $3_5 - $2_5)',
  height: '$0_5',
  marginLeft: '$3_5',
  borderRadius: '$full',
  backgroundColor: '$blue-500',
  opacity: 0,
});
