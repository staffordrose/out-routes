import {
  FC,
  MutableRefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { UseFieldArrayUpdate } from 'react-hook-form';
import type { Map } from 'mapbox-gl';
import {
  BiDotsVerticalRounded,
  BiEditAlt,
  BiLayer,
  BiShapePolygon,
  BiShareAlt,
  BiTrash,
} from 'react-icons/bi';
import { MdDragHandle } from 'react-icons/md';
import { gsap } from 'gsap';
import Draggable from 'gsap/dist/Draggable';

import { Button, Dialog, DropdownMenu, IconButton } from '@/components/atoms';
import {
  GeometryTypeNames,
  GeometryTypes,
  SymbolCodes,
  symbolIcons,
} from '@/data/routes';
import { styled } from '@/styles';
import { LngLat, MapFeature, PopupState } from '@/types';
import { getFeatureLngLat, getMapBoundsFromCoordinates } from '@/utils';
import {
  FeatureValues,
  LayerValues,
  mapFeatureValuesToMapFeature,
  RouteFormValues,
} from '../../../../../helpers';
import { deleteLayerFeature } from '../../../../helpers';
import { FeatureMove } from './FeatureMove';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(Draggable);
}

type FeatureProps = {
  update: UseFieldArrayUpdate<RouteFormValues, 'layers'>;
  map: MutableRefObject<Map | undefined>;
  layerIndex: number;
  layer: LayerValues;
  containerRef: MutableRefObject<HTMLDivElement | null>;
  showActiveIndicator: (y: number) => void;
  hideActiveIndicator: () => void;
  featureOrder: number;
  featuresLength: number;
  feature: FeatureValues;
  openPopup: (popupState: PopupState) => void;
  closePopup: () => void;
  openFeatureEditDialog: (
    layerIndex: number,
    layer: LayerValues,
    feature: MapFeature
  ) => void;
  isLayerFeaturesReordering: boolean;
};

export const Feature: FC<FeatureProps> = ({
  update,
  map,
  layerIndex,
  layer,
  containerRef,
  showActiveIndicator,
  hideActiveIndicator,
  featureOrder,
  featuresLength,
  feature,
  openPopup,
  closePopup,
  openFeatureEditDialog,
  isLayerFeaturesReordering,
}) => {
  const [isFeatureMoveDialogOpen, setFeatureMoveDialogOpen] = useState(false);

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

  const { type, title, color, symbol } = feature;

  const SymbolIcon =
    type === GeometryTypes.LineString
      ? BiShareAlt
      : type === GeometryTypes.Polygon
      ? BiShapePolygon
      : symbolIcons[
          (symbol || layer.symbol || SymbolCodes.Marker) as SymbolCodes
        ];

  const mapFeature = useMemo(
    () =>
      mapFeatureValuesToMapFeature(
        {
          id: layer.databaseId as string,
          color: layer.color,
          symbol: layer.symbol,
        },
        featureOrder,
        feature
      ),
    [layer, featureOrder, feature]
  );

  return (
    <>
      <Dialog
        maxWidth='xs'
        isOpen={isFeatureMoveDialogOpen}
        setOpen={setFeatureMoveDialogOpen}
        title='Select a Section'
        body={
          <FeatureMove
            update={update}
            layerIndex={layerIndex}
            featureOrder={featureOrder}
          />
        }
      />
      <StyledFeature>
        <Button
          type='button'
          variant='ghost'
          size='xs'
          onClick={() => {
            const center = getFeatureLngLat(mapFeature);

            openPopup({
              center,
              feature: mapFeature,
            });

            if (
              mapFeature.geometry.type === GeometryTypeNames.Polygon ||
              mapFeature.geometry.type === GeometryTypeNames.LineString
            ) {
              const mapBounds = getMapBoundsFromCoordinates(
                (mapFeature.geometry.type === GeometryTypeNames.Polygon
                  ? mapFeature.geometry.coordinates[0]
                  : mapFeature.geometry.coordinates) as LngLat[]
              );

              if (mapBounds) {
                map.current?.fitBounds(mapBounds, {
                  padding: 48,
                });
              }
            } else {
              // fly to point
              map.current?.flyTo({ center, zoom: 14 });
            }
          }}
        >
          <SymbolIcon
            style={{
              fill: color || layer.color || undefined,
            }}
          />
          <span>{title || '[Untitled feature]'}</span>
        </Button>
        {isLayerFeaturesReordering ? (
          <DragHandle dragRef={dragRef} />
        ) : (
          <DropdownMenu
            items={[
              <DropdownMenu.Item
                key='edit-feature'
                size='xs'
                aria-label='Open modal to edit the feature'
                onSelect={() => {
                  openFeatureEditDialog(layerIndex, layer, mapFeature);
                  closePopup();
                }}
              >
                <BiEditAlt />
                <span>Edit Feature</span>
              </DropdownMenu.Item>,
              <DropdownMenu.Item
                key='move-feature'
                size='xs'
                aria-label='Open modal to move the feature'
                onSelect={() => {
                  setFeatureMoveDialogOpen(true);
                  closePopup();
                }}
              >
                <BiLayer />
                <span>Move to Section</span>
              </DropdownMenu.Item>,
              <DropdownMenu.Separator key='delete-separator' />,
              <DropdownMenu.Item
                key='delete-feature'
                size='xs'
                colorScheme='red'
                aria-label='Open modal to delete the feature'
                onSelect={() => {
                  deleteLayerFeature(update, layerIndex, layer, mapFeature);
                  closePopup();
                }}
              >
                <BiTrash />
                <span>Delete Feature</span>
              </DropdownMenu.Item>,
            ]}
          >
            <IconButton type='button' variant='ghost' size='xs'>
              <BiDotsVerticalRounded />
            </IconButton>
          </DropdownMenu>
        )}
      </StyledFeature>
    </>
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
  gridTemplateColumns: '1fr 32px',
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
  '& > button:last-child': {
    justifySelf: 'center',
  },
  [`& > ${DragHandle}`]: {
    '& > *': {
      pointerEvents: 'none',
    },
  },
});
