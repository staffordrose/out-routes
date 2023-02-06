import { FC } from 'react';
import {
  FieldArrayWithId,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
} from 'react-hook-form';
import { BiPlus } from 'react-icons/bi';

import { Button, List } from '@/components/atoms';
import { ColorCodes } from '@/data/general';
import { SymbolCodes } from '@/data/routes';
import { styled } from '@/styles';
import { PopupState } from '@/types';
import { createAlphaNumericId } from '@/utils';
import { RouteFormValues } from '../../../helpers';
import { Layer } from './Layer';

type MapLayersFeaturesProps = {
  fields: FieldArrayWithId<RouteFormValues, 'layers', 'id'>[];
  append: UseFieldArrayAppend<RouteFormValues, 'layers'>;
  remove: UseFieldArrayRemove;
  openPopup: (popupState: PopupState) => void;
};

export const MapLayersFeatures: FC<MapLayersFeaturesProps> = ({
  fields,
  append,
  remove,
  openPopup,
}) => {
  return (
    <div>
      <List as='ul' direction='column' width='full'>
        {fields.map((item, index) => {
          return (
            <Layer
              key={item.id}
              remove={remove}
              item={item}
              layerIndex={index}
              openPopup={openPopup}
            />
          );
        })}
      </List>

      <AddLayer>
        <Button
          size='xs'
          display='flex'
          type='button'
          onClick={() =>
            append({
              databaseId: createAlphaNumericId(24),
              title: '',
              color: ColorCodes.Red,
              symbol: SymbolCodes.Marker,
            })
          }
        >
          <BiPlus />
          Add Layer
        </Button>
      </AddLayer>
    </div>
  );
};

const AddLayer = styled('div', {
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  minHeight: '$12',
  padding: '$2',
  paddingLeft: '$3_5',
});
