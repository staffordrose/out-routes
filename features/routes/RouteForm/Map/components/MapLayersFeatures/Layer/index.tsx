import { FC, useState } from 'react';
import {
  FieldArrayWithId,
  UseFieldArrayRemove,
  useFormContext,
  useWatch,
} from 'react-hook-form';

import { Box } from '@/components/atoms';
import { MapLayer, PopupState } from '@/types';
import { RouteFormValues } from '../../../../helpers';
import { LayerDetails } from './LayerDetails';
import { LayerFeatures } from './LayerFeatures';
import { LayerFields } from './LayerFields';

type LayerProps = {
  remove: UseFieldArrayRemove;
  item: FieldArrayWithId<RouteFormValues, 'layers', 'id'>;
  layerIndex: number;
  openPopup: (popupState: PopupState) => void;
  setActiveLayerId: (id: MapLayer['id'] | null) => void;
};

export const Layer: FC<LayerProps> = ({
  remove,
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
    <Box
      as='li'
      onClick={() => {
        if (item.databaseId) {
          setActiveLayerId(item.databaseId);
        }
      }}
      css={{
        position: 'relative',
        width: '$full',
        borderBottomWidth: '$2',
        borderBottomStyle: 'solid',
        borderBottomColor: '$slate-200',
        '&::before': {
          content: '',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '$1_5',
          height: '$full',
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
      <LayerFeatures layerIndex={layerIndex} openPopup={openPopup} />
    </Box>
  );
};
