import { FC, MutableRefObject, useRef } from 'react';
import { UseFieldArrayUpdate, useFormContext, useWatch } from 'react-hook-form';
import type { Map } from 'mapbox-gl';
import { BiShapePolygon } from 'react-icons/bi';

import { Feedback } from '@/components/layout';
import { styled } from '@/styles';
import { MapFeature, PopupState } from '@/types';
import { LayerValues, RouteFormValues } from '../../../../../helpers';
import { Feature } from './Feature';

type LayerFeaturesProps = {
  update: UseFieldArrayUpdate<RouteFormValues, 'layers'>;
  map: MutableRefObject<Map | undefined>;
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
  map,
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

  const renderResult = () => {
    if (!Array.isArray(layer.features) || !layer.features.length) {
      return (
        <EmptyState>
          <Feedback
            size='xs'
            type='empty'
            icon={BiShapePolygon}
            title='No Features'
          >
            This section does not have any features.
          </Feedback>
        </EmptyState>
      );
    }
    return (
      <FeaturesGrid ref={containerRef}>
        <ActiveIndicator ref={activeIndicatorRef} />
        {layer.features.map((feature, featureOrder) => {
          return (
            <Feature
              key={feature.databaseId}
              update={update}
              map={map}
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
      </FeaturesGrid>
    );
  };

  return <StyledLayerFeatures>{renderResult()}</StyledLayerFeatures>;
};

const StyledLayerFeatures = styled('div', {
  borderBottomWidth: '$1',
  borderBottomStyle: 'solid',
  borderBottomColor: '$slate-300',
});

const FeaturesGrid = styled('div', {
  position: 'relative',
  width: '$full',
  marginY: '$2',
  paddingLeft: '$3_5',
  paddingRight: '$2',
  '& > button': {
    justifyContent: 'flex-start',
    width: '$full',
  },
});

const ActiveIndicator = styled('div', {
  position: 'absolute',
  zIndex: 10,
  top: 0,
  width: 'calc(100% - $6)',
  height: '$0_5',
  borderRadius: '$full',
  backgroundColor: '$blue-500',
  opacity: 0,
});

const EmptyState = styled('div', {
  paddingLeft: '$1_5',
});
