import { FC } from 'react';
import {
  FieldArrayWithId,
  UseFieldArrayRemove,
  UseFieldArrayUpdate,
  useFormContext,
  useWatch,
} from 'react-hook-form';

import { styled } from '@/styles';
import { MapLayer, PopupState } from '@/types';
import { LayerValues, RouteFormValues } from '../../../../helpers';
import { LayerDetails } from './LayerDetails';
import { LayerFeatures } from './LayerFeatures';

type LayerProps = {
  remove: UseFieldArrayRemove;
  update: UseFieldArrayUpdate<RouteFormValues, 'layers'>;
  item: FieldArrayWithId<RouteFormValues, 'layers', 'id'>;
  layerIndex: number;
  openPopup: (popupState: PopupState) => void;
  setActiveLayerId: (id: MapLayer['id'] | null) => void;
  layersWithFeaturesReordering: Set<LayerValues['databaseId']>;
  toggleLayerFeaturesReordering: (layerId: LayerValues['databaseId']) => void;
};

export const Layer: FC<LayerProps> = ({
  remove,
  update,
  item,
  layerIndex,
  openPopup,
  setActiveLayerId,
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
        update={update}
        remove={remove}
        setActiveLayerId={setActiveLayerId}
        layerIndex={layerIndex}
        isLayerFeaturesReordering={isLayerFeaturesReordering}
        toggleLayerFeaturesReordering={toggleLayerFeaturesReordering}
      />
      <LayerFeatures
        update={update}
        layerIndex={layerIndex}
        openPopup={openPopup}
        isLayerFeaturesReordering={isLayerFeaturesReordering}
      />
    </StyledLayer>
  );
};

const StyledLayer = styled('li', {
  position: 'relative',
  width: '$full',
  borderBottomWidth: '$1',
  borderBottomStyle: 'solid',
  borderBottomColor: '$slate-300',
  '&::before': {
    content: '',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '$1_5',
    height: '$full',
  },
});
