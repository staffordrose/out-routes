import { FC, useState } from 'react';
import {
  FieldArrayWithId,
  UseFieldArrayRemove,
  UseFieldArrayUpdate,
  useFormContext,
  useWatch,
} from 'react-hook-form';

import { styled } from '@/styles';
import { MapLayer, PopupState } from '@/types';
import { RouteFormValues } from '../../../../helpers';
import { LayerDetails } from './LayerDetails';
import { LayerFeatures } from './LayerFeatures';
import { LayerFields } from './LayerFields';

type LayerProps = {
  remove: UseFieldArrayRemove;
  update: UseFieldArrayUpdate<RouteFormValues, 'layers'>;
  item: FieldArrayWithId<RouteFormValues, 'layers', 'id'>;
  layerIndex: number;
  openPopup: (popupState: PopupState) => void;
  setActiveLayerId: (id: MapLayer['id'] | null) => void;
};

export const Layer: FC<LayerProps> = ({
  remove,
  update,
  item,
  layerIndex,
  openPopup,
  setActiveLayerId,
}) => {
  const [isFieldsVisible, setFieldsVisible] = useState(false);
  const toggleFieldsVisibility = () => setFieldsVisible(!isFieldsVisible);

  const { control } = useFormContext<RouteFormValues>();

  const activeLayerId = useWatch({ control, name: 'activeLayerId' });
  const color = useWatch({ control, name: `layers.${layerIndex}.color` });

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
        remove={remove}
        setActiveLayerId={setActiveLayerId}
        layerIndex={layerIndex}
        isFieldsVisible={isFieldsVisible}
        toggleFieldsVisibility={toggleFieldsVisibility}
      />
      {isFieldsVisible && <LayerFields layerIndex={layerIndex} />}
      <LayerFeatures
        update={update}
        layerIndex={layerIndex}
        openPopup={openPopup}
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
