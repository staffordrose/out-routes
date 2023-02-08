import { FC } from 'react';
import NextImage from 'next/image';
import {
  Control,
  Controller,
  useFieldArray,
  useFormContext,
  useWatch,
} from 'react-hook-form';
import { BiPlus, BiTrash } from 'react-icons/bi';

import { Button, Flex, IconButton, TruncatedText } from '@/components/atoms';
import {
  Accordion,
  SelectField,
  TextareaField,
  TextField,
} from '@/components/molecules';
import { colorSelectOptions } from '@/data/general';
import {
  GeometryTypes,
  geometryTypeSelectOptions,
  symbolSelectOptions,
} from '@/data/routes';
import { styled } from '@/styles';
import { PopupState } from '@/types';
import { createAlphaNumericId } from '@/utils';
import { RouteFormValues } from '../../../../helpers';
import { CoordinatesFieldArray } from './CoordinatesFieldArray';

type FeaturesFieldArrayProps = {
  layerIndex: number;
  openPopup: (popupState: PopupState) => void;
};

export const FeaturesFieldArray: FC<FeaturesFieldArrayProps> = ({
  layerIndex,
  openPopup, // TODO: Add functionality to open a feature popup
}) => {
  const { control } = useFormContext<RouteFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: `layers.${layerIndex}.features`,
  });

  return (
    <StyledFeaturesFieldArray>
      <div>
        <Accordion
          size='sm'
          type='single'
          items={fields.map((item, featureIndex) => {
            return {
              value: item.id,
              trigger: (
                <Title
                  control={control}
                  layerIndex={layerIndex}
                  featureIndex={featureIndex}
                />
              ),
              content: (
                <Flex key={item.id} gap='sm' justifyContent='space-between'>
                  <Flex direction='column' gap='sm'>
                    <Controller
                      name={`layers.${layerIndex}.features.${featureIndex}.title`}
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
                      name={`layers.${layerIndex}.features.${featureIndex}.type`}
                      control={control}
                      render={({ field, fieldState: { isTouched, error } }) => (
                        <SelectField
                          {...field}
                          placeholder='Type'
                          isTouched={isTouched}
                          error={error?.message}
                          disabled={true}
                          groups={[
                            {
                              id: 'types',
                              label: 'Types',
                              options: geometryTypeSelectOptions.map(
                                ({ value, label }) => ({
                                  value,
                                  label: <TruncatedText>{label}</TruncatedText>,
                                })
                              ),
                            },
                          ]}
                        />
                      )}
                    />
                    <CoordinatesFieldArray
                      control={control}
                      layerIndex={layerIndex}
                      featureIndex={featureIndex}
                    />
                    <Controller
                      name={`layers.${layerIndex}.features.${featureIndex}.color`}
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
                              options: colorSelectOptions.map(
                                ({ value, label }) => ({
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
                                })
                              ),
                            },
                          ]}
                        />
                      )}
                    />
                    <SymbolField
                      control={control}
                      layerIndex={layerIndex}
                      featureIndex={featureIndex}
                    />
                    <Controller
                      name={`layers.${layerIndex}.features.${featureIndex}.description`}
                      control={control}
                      render={({ field, fieldState: { isTouched, error } }) => (
                        <TextareaField
                          {...field}
                          placeholder='Description'
                          isTouched={isTouched}
                          error={error?.message}
                          rows={6}
                        />
                      )}
                    />
                  </Flex>
                  <IconButton
                    type='button'
                    variant='ghost'
                    onClick={() => remove(featureIndex)}
                  >
                    <BiTrash />
                  </IconButton>
                </Flex>
              ),
            };
          })}
        />
      </div>
      <AddFeature>
        <Button
          display='flex'
          type='button'
          onClick={() =>
            append({
              files: [],
              databaseId: createAlphaNumericId(24),
              type: GeometryTypes.Point,
              coordinates: [{ lat: '', lng: '' }],
              title: '',
              color: undefined,
              symbol: undefined,
              description: '',
              ele_start: 0,
              ele_end: 0,
              distance: 0,
              area: 0,
              image_id: null,
              image_full: null,
              image_large: null,
              image_card_banner: null,
              image_thumb_360: null,
              image_thumb_240: null,
              image_thumb_120: null,
            })
          }
        >
          <BiPlus />
          Add Feature
        </Button>
      </AddFeature>
    </StyledFeaturesFieldArray>
  );
};

const StyledFeaturesFieldArray = styled('div', {
  '& > div:first-child': {
    padding: '$2',
    paddingLeft: '$3_5',
  },
});

const AddFeature = styled('div', {
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  minHeight: '$12',
  padding: '$2',
  paddingLeft: '$3_5',
  borderWidth: '$1',
  borderStyle: 'solid',
  borderColor: '$slate-200',
});

type TitleProps = {
  control: Control<RouteFormValues>;
  layerIndex: number;
  featureIndex: number;
};

const Title: FC<TitleProps> = ({ control, layerIndex, featureIndex }) => {
  const featureTitle = useWatch({
    control,
    name: `layers.${layerIndex}.features.${featureIndex}.title`,
  });

  return <>{featureTitle || '[Untitled feature]'}</>;
};

type SymbolFieldProps = {
  control: Control<RouteFormValues>;
  layerIndex: number;
  featureIndex: number;
};

const SymbolField: FC<SymbolFieldProps> = ({
  control,
  layerIndex,
  featureIndex,
}) => {
  const feature = useWatch({
    control,
    name: `layers.${layerIndex}.features.${featureIndex}`,
  });

  return feature?.type === GeometryTypes.Point ? (
    <Controller
      name={`layers.${layerIndex}.features.${featureIndex}.symbol`}
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
  ) : null;
};

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
