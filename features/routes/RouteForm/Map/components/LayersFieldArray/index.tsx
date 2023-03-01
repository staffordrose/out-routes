import { FC, useState } from 'react';
import NextImage from 'next/image';
import {
  Controller,
  FieldArrayWithId,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  useFormContext,
  useWatch,
} from 'react-hook-form';
import { BiTrash, BiEditAlt, BiX, BiPlus } from 'react-icons/bi';

import {
  Box,
  Button,
  IconButton,
  List,
  TruncatedText,
} from '@/components/atoms';
import { SelectField, TextField } from '@/components/molecules';
import { ColorCodes, colorSelectOptions } from '@/data/general';
import { SymbolCodes, symbolIcons, symbolSelectOptions } from '@/data/routes';
import { styled } from '@/styles';
import { PopupState } from '@/types';
import { createAlphaNumericId } from '@/utils';
import { RouteFormValues } from '../../../helpers';
import { FeaturesFieldArray } from './FeaturesFieldArray';

type LayersFieldArrayProps = {
  fields: FieldArrayWithId<RouteFormValues, 'layers', 'id'>[];
  append: UseFieldArrayAppend<RouteFormValues, 'layers'>;
  remove: UseFieldArrayRemove;
  openPopup: (popupState: PopupState) => void;
};

export const LayersFieldArray: FC<LayersFieldArrayProps> = ({
  fields,
  append,
  remove,
  openPopup,
}) => {
  return (
    <StyledLayersFieldArray>
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
    </StyledLayersFieldArray>
  );
};

const StyledLayersFieldArray = styled('div', {
  overflow: 'hidden',
  borderWidth: '$2',
  borderStyle: 'solid',
  borderColor: '$slate-200',
  borderRadius: '$md',
});

const AddLayer = styled('div', {
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  minHeight: '$12',
  padding: '$2',
  paddingLeft: '$3_5',
});

type LayerProps = {
  remove: UseFieldArrayRemove;
  item: FieldArrayWithId<RouteFormValues, 'layers', 'id'>;
  layerIndex: number;
  openPopup: (popupState: PopupState) => void;
};

const Layer: FC<LayerProps> = ({ remove, item, layerIndex, openPopup }) => {
  const [isFieldsVisible, setFieldsVisible] = useState(false);
  const toggleFieldsVisibility = () => setFieldsVisible(!isFieldsVisible);

  const { control, setValue } = useFormContext<RouteFormValues>();

  const activeLayerId = useWatch({ control, name: 'activeLayerId' });
  const color = useWatch({ control, name: `layers.${layerIndex}.color` });

  return (
    <Box
      as='li'
      onClick={() => {
        item.databaseId && setValue('activeLayerId', item.databaseId);
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
        layerIndex={layerIndex}
        isFieldsVisible={isFieldsVisible}
        toggleFieldsVisibility={toggleFieldsVisibility}
      />
      {isFieldsVisible && <LayerFields layerIndex={layerIndex} />}
      <FeaturesFieldArray layerIndex={layerIndex} openPopup={openPopup} />
    </Box>
  );
};

type LayerDetailsProps = {
  remove: UseFieldArrayRemove;
  layerIndex: number;
  isFieldsVisible: boolean;
  toggleFieldsVisibility: () => void;
};

const LayerDetails: FC<LayerDetailsProps> = ({
  remove,
  layerIndex,
  isFieldsVisible,
  toggleFieldsVisibility,
}) => {
  const { control } = useFormContext<RouteFormValues>();

  const layer = useWatch({
    control,
    name: `layers.${layerIndex}`,
  });

  const SymbolIcon =
    symbolIcons[(layer.symbol || SymbolCodes.Marker) as SymbolCodes];

  return (
    <StyledLayerDetails>
      <div>
        <SymbolIcon
          style={{
            fill: layer.color || undefined,
          }}
        />
        <TruncatedText as='h4' lineClamp={1}>
          {layer.title || '[Untitled layer]'}
        </TruncatedText>
      </div>
      <div>
        {!isFieldsVisible && (
          <IconButton
            type='button'
            variant='ghost'
            onClick={() => remove(layerIndex)}
          >
            <BiTrash />
          </IconButton>
        )}
        <IconButton
          type='button'
          variant='ghost'
          onClick={toggleFieldsVisibility}
        >
          {isFieldsVisible ? <BiX /> : <BiEditAlt />}
        </IconButton>
      </div>
    </StyledLayerDetails>
  );
};

const StyledLayerDetails = styled('div', {
  display: 'flex',
  gap: '$1',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '$full',
  minHeight: '$12',
  paddingLeft: '$5',
  paddingRight: '$2',
  borderBottomWidth: '$1',
  borderBottomStyle: 'solid',
  borderBottomColor: '$slate-200',
  '& > div:first-child': {
    display: 'flex',
    gap: '$0_5',
    alignItems: 'center',
    '& > svg': {
      flexShrink: 0,
      width: '$7',
      height: '$7',
    },
  },
  '& > div:last-child': {
    display: 'flex',
    gap: '$1',
    alignItems: 'center',
  },
});

type LayerFieldsProps = {
  layerIndex: number;
};

const LayerFields: FC<LayerFieldsProps> = ({ layerIndex }) => {
  const { control } = useFormContext<RouteFormValues>();

  return (
    <StyledLayerFields>
      <Controller
        name={`layers.${layerIndex}.title`}
        control={control}
        render={({ field, fieldState: { isTouched, error } }) => (
          <TextField
            {...field}
            placeholder='Name'
            isTouched={isTouched}
            error={error?.message}
          />
        )}
      />
      <Controller
        name={`layers.${layerIndex}.color`}
        control={control}
        render={({ field, fieldState: { isTouched, error } }) => (
          <SelectField
            {...field}
            placeholder='Color'
            isTouched={isTouched}
            error={error?.message}
            groups={[
              {
                id: 'colors',
                label: 'Colors',
                options: colorSelectOptions.map(({ value, label }) => ({
                  value,
                  label: (
                    <ColorLabel>
                      <span
                        style={{
                          backgroundColor: value,
                        }}
                      />
                      <TruncatedText>{label}</TruncatedText>
                    </ColorLabel>
                  ),
                })),
              },
            ]}
          />
        )}
      />
      <Controller
        name={`layers.${layerIndex}.symbol`}
        control={control}
        render={({ field, fieldState: { isTouched, error } }) => (
          <SelectField
            {...field}
            placeholder='Symbol'
            isTouched={isTouched}
            error={error?.message}
            groups={[
              {
                id: 'symbols',
                label: 'Symbols',
                options: symbolSelectOptions.map(({ value, label }) => ({
                  value,
                  label: (
                    <SymbolLabel>
                      <NextImage
                        src={`/symbols/${value}.svg`}
                        height={16}
                        width={16}
                        alt={`${label} Icon`}
                      />
                      <TruncatedText>{label}</TruncatedText>
                    </SymbolLabel>
                  ),
                })),
              },
            ]}
          />
        )}
      />
    </StyledLayerFields>
  );
};

const StyledLayerFields = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax($56, 1fr))',
  gap: '$2',
  width: '$full',
  minHeight: '$12',
  padding: '$2',
  paddingLeft: '$3_5',
  borderBottomWidth: '$1',
  borderBottomStyle: 'solid',
  borderBottomColor: '$slate-200',
  '& > *': {
    flexShrink: 1,
  },
});

const ColorLabel = styled('div', {
  display: 'flex',
  gap: '$1',
  placeItems: 'center',
  '& > span:first-child': {
    display: 'inline-block',
    width: '$4',
    height: '$4',
    borderRadius: '$sm',
  },
});

const SymbolLabel = styled('div', {
  display: 'flex',
  gap: '$1',
  placeItems: 'center',
});
