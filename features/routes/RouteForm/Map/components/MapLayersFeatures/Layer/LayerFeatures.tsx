import { FC, MutableRefObject, useEffect, useRef } from 'react';
import { UseFieldArrayUpdate, useFormContext, useWatch } from 'react-hook-form';
import { BiShapePolygon, BiShareAlt } from 'react-icons/bi';
import { MdDragHandle } from 'react-icons/md';
import { gsap } from 'gsap';
import Draggable from 'gsap/dist/Draggable';

import { Box, Button, IconButton } from '@/components/atoms';
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

if (typeof window !== 'undefined') {
  gsap.registerPlugin(Draggable);
}

type LayerFeaturesProps = {
  update: UseFieldArrayUpdate<RouteFormValues, 'layers'>;
  layerIndex: number;
  openPopup: (popupState: PopupState) => void;
  isLayerFeaturesReordering: boolean;
};

export const LayerFeatures: FC<LayerFeaturesProps> = ({
  update,
  layerIndex,
  openPopup,
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

  const { color, symbol, features } = layer;

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
    <StyledLayerFeatures ref={containerRef}>
      <ActiveIndicator ref={activeIndicatorRef} />
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
          <Feature
            key={feature.databaseId}
            update={update}
            layerIndex={layerIndex}
            layer={layer}
            containerRef={containerRef}
            showActiveIndicator={showActiveIndicator}
            hideActiveIndicator={hideActiveIndicator}
            featureOrder={featureOrder}
            featuresLength={features?.length || 0}
            feature={feature}
            isLayerFeaturesReordering={isLayerFeaturesReordering}
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

type FeatureProps = {
  update: UseFieldArrayUpdate<RouteFormValues, 'layers'>;
  layerIndex: number;
  layer: LayerValues;
  containerRef: MutableRefObject<HTMLDivElement | null>;
  showActiveIndicator: (y: number) => void;
  hideActiveIndicator: () => void;
  featureOrder: number;
  featuresLength: number;
  feature: FeatureValues;
  isLayerFeaturesReordering: boolean;
  onClick: () => void;
};

const Feature: FC<FeatureProps> = ({
  update,
  layerIndex,
  layer,
  containerRef,
  showActiveIndicator,
  hideActiveIndicator,
  featureOrder,
  featuresLength,
  feature: { type, title, color, symbol },
  isLayerFeaturesReordering,
  onClick,
}) => {
  const dragRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (dragRef.current) {
      Draggable.create(dragRef.current, {
        type: 'y',
        bounds: containerRef.current,
        snap: {
          y: (endValue) => {
            return Math.round(endValue / 28) * 28;
          },
        },
        onDrag: function () {
          const change =
            (this.y > 0 ? Math.floor(this.y / 28) : Math.ceil(this.y / 28)) *
            28;

          let direction = this.getDirection();

          if (featureOrder === 0 && change <= 28) {
            direction = 'down';
          } else if (featureOrder === featuresLength - 1 && change <= 28) {
            direction = 'up';
          } else {
            direction = direction === 'down' ? 'down' : 'up';
          }

          const start = (featureOrder + (direction === 'down' ? 1 : 0)) * 28;

          const position = start + change;

          showActiveIndicator(position);
        },
        onDragEnd: function () {
          if (!Array.isArray(layer.features) || !layer.features.length) {
            return;
          }

          const from = featureOrder;
          const to =
            featureOrder +
            (this.y > 0 ? Math.floor(this.y / 28) : Math.ceil(this.y / 28));

          if (from === to) {
            update(layerIndex, layer);
            return;
          }

          const feature = layer.features[from];

          let features = layer.features.filter((_, index) => index !== from);
          features = [...features.slice(0, to), feature, ...features.slice(to)];

          update(layerIndex, { ...layer, features });

          hideActiveIndicator();
        },
      });
    }
  }, [
    update,
    containerRef,
    dragRef,
    showActiveIndicator,
    hideActiveIndicator,
    layerIndex,
    layer,
    layer.features,
    featureOrder,
    featuresLength,
  ]);

  const SymbolIcon =
    type === GeometryTypes.LineString
      ? BiShareAlt
      : type === GeometryTypes.Polygon
      ? BiShapePolygon
      : symbolIcons[
          (symbol || layer.symbol || SymbolCodes.Marker) as SymbolCodes
        ];

  return (
    <StyledFeature>
      <Button type='button' variant='ghost' size='xs' onClick={onClick}>
        <SymbolIcon
          style={{
            fill: color || layer.color || undefined,
          }}
        />
        <span>{title || '[Untitled feature]'}</span>
      </Button>
      {isLayerFeaturesReordering ? <DragHandle dragRef={dragRef} /> : <div />}
    </StyledFeature>
  );
};

type DragHandleProps = {
  dragRef: MutableRefObject<HTMLButtonElement | null>;
};

const DragHandle: FC<DragHandleProps> = ({ dragRef }) => {
  return (
    <IconButton
      ref={dragRef}
      className='drag-handle'
      type='button'
      variant='ghost'
      size='xs'
      aria-label='Move feature'
    >
      <MdDragHandle />
    </IconButton>
  );
};

DragHandle.toString = () => '.drag-handle';

const StyledFeature = styled('div', {
  display: 'grid',
  gridTemplateColumns: '1fr 28px',
  gap: '$1',
  width: '$full',
  [`&:has(> ${DragHandle}:focus) > button:first-child`]: {
    opacity: 0.5,
  },
  [`&:has(> ${DragHandle}:active) > button:first-child`]: {
    opacity: 0.5,
  },
  '& > button:first-child': {
    justifyContent: 'flex-start',
    '& > span': {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: '-webkit-box',
      WebkitBoxOrient: 'vertical',
      WebkitLineClamp: 1,
      lineClamp: 1,
    },
  },
  [`& > ${DragHandle}`]: {
    '& > *': {
      pointerEvents: 'none',
    },
  },
});
