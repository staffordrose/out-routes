import { FC } from 'react';
import {
  FieldArrayWithId,
  UseFieldArrayMove,
  UseFieldArrayRemove,
  UseFieldArrayUpdate,
  useFormContext,
  useWatch,
} from 'react-hook-form';

import { styled } from '@/styles';
import { MapFeature, MapLayer, PopupState } from '@/types';
import { LayerValues, RouteFormValues } from '../../../../helpers';
import { LayerDetails } from './LayerDetails';
import { LayerFeatures } from './LayerFeatures';

type LayerProps = {
  move: UseFieldArrayMove;
  remove: UseFieldArrayRemove;
  update: UseFieldArrayUpdate<RouteFormValues, 'layers'>;
  item: FieldArrayWithId<RouteFormValues, 'layers', 'id'>;
  layersCount: number;
  layerIndex: number;
  setActiveLayerId: (id: MapLayer['id'] | null) => void;
  openPopup: (popupState: PopupState) => void;
  closePopup: () => void;
  openFeatureEditDialog: (
    layerIndex: number,
    layer: LayerValues,
    feature: MapFeature
  ) => void;
  layersWithFeaturesReordering: Set<LayerValues['databaseId']>;
  toggleLayerFeaturesReordering: (layerId: LayerValues['databaseId']) => void;
};

export const Layer: FC<LayerProps> = ({
  move,
  remove,
  update,
  item,
  layersCount,
  layerIndex,
  setActiveLayerId,
  openPopup,
  closePopup,
  openFeatureEditDialog,
  layersWithFeaturesReordering,
  toggleLayerFeaturesReordering,
}) => {
  const { control } = useFormContext<RouteFormValues>();

  const activeLayerId = useWatch({ control, name: 'activeLayerId' });
  const color = useWatch({ control, name: `layers.${layerIndex}.color` });

  const isLayerFeaturesReordering = layersWithFeaturesReordering.has(
    item.databaseId
  );

  return (
    <StyledLayer
      onClick={() => {
        if (item.databaseId) {
          setActiveLayerId(item.databaseId);
        }
      }}
      css={{
        '&::before': {
          backgroundColor: color,
          opacity: item.databaseId === activeLayerId ? 1 : 0.25,
        },
      }}
    >
      <LayerDetails
        move={move}
        remove={remove}
        update={update}
        setActiveLayerId={setActiveLayerId}
        layersCount={layersCount}
        layerIndex={layerIndex}
        isLayerFeaturesReordering={isLayerFeaturesReordering}
        toggleLayerFeaturesReordering={toggleLayerFeaturesReordering}
      />
      <LayerFeatures
        update={update}
        layerIndex={layerIndex}
        openPopup={openPopup}
        closePopup={closePopup}
        openFeatureEditDialog={openFeatureEditDialog}
        isLayerFeaturesReordering={isLayerFeaturesReordering}
      />
    </StyledLayer>
  );
};

const StyledLayer = styled('li', {
  position: 'relative',
  width: '$full',
  '&::before': {
    content: '',
    position: 'absolute',
    zIndex: 100,
    top: 0,
    left: 0,
    width: '$1_5',
    height: '$full',
  },
});
