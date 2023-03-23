import { FC, useState } from 'react';
import NextImage from 'next/image';
import { UseFieldArrayUpdate } from 'react-hook-form';
import { nanoid } from 'nanoid';

import { Button, Flex, Text, TruncatedText } from '@/components/atoms';
import { SelectField, TextareaField, TextField } from '@/components/molecules';
import {
  colorCodes,
  nonStandardColorSelectOptions,
  standardColorSelectOptions,
} from '@/data/general';
import { GeometryTypeNames, symbolSelectOptions } from '@/data/routes';
import { styled } from '@/styles';
import { MapFeature, PopupState } from '@/types/maps';
import { LayerValues, RouteFormValues } from '../../../helpers';
import { UseFeatureEditForm } from './hooks';

type FeatureEditProps = {
  update: UseFieldArrayUpdate<RouteFormValues, 'layers'>;
  layerIndex: number;
  layer: LayerValues;
  feature: MapFeature;
  openPopup: (popupState: PopupState) => void;
  closeFeatureEditDialog: () => void;
};

export const FeatureEdit: FC<FeatureEditProps> = ({
  update,
  layerIndex,
  layer,
  feature,
  openPopup,
  closeFeatureEditDialog,
}) => {
  const {
    status,
    values,
    touched,
    errors,
    updateValues,
    updateTouched,
    validate,
    onSubmit,
  } = UseFeatureEditForm({
    update,
    layerIndex,
    layer,
    feature,
    openPopup,
    closeFeatureEditDialog,
  });

  // key is changed when user removes selection
  const [colorKey, setColorKey] = useState(nanoid());
  const [symbolKey, setSymbolKey] = useState(nanoid());

  if (!feature.id) {
    return null;
  }

  return (
    <StyledFeatureEdit>
      <Flex direction='column' gap='sm' width='full'>
        {!!status && (
          <StatusWrapper>
            <Text color='red-700'>{status}</Text>
          </StatusWrapper>
        )}
        <TextField
          name='title'
          placeholder='Name'
          value={values.title}
          onChange={(e) => {
            updateValues('title', e.target.value);
          }}
          onBlur={() => {
            updateTouched('title', true);
            validate();
          }}
          isTouched={touched.title}
          error={errors.title?.message}
        />
        <FieldsGrid>
          {feature.geometry.type === GeometryTypeNames.Point && (
            <CoordinatesFieldsGrid>
              <TextField
                type='number'
                name='lat'
                placeholder='Latitude'
                value={values.lat}
                onChange={(e) => {
                  updateValues('lat', e.target.value);
                }}
                onBlur={() => {
                  updateTouched('lat', true);
                  validate();
                }}
                isTouched={touched.lat}
                error={errors.lat?.message}
              />
              <TextField
                type='number'
                name='lng'
                placeholder='Longitude'
                value={values.lng}
                onChange={(e) => {
                  updateValues('lng', e.target.value);
                }}
                onBlur={() => {
                  updateTouched('lng', true);
                  validate();
                }}
                isTouched={touched.lng}
                error={errors.lng?.message}
              />
            </CoordinatesFieldsGrid>
          )}
          <SelectField
            key={colorKey}
            name='color'
            placeholder='Color'
            value={values.color}
            onChange={(value) => {
              if (value === 'none') {
                updateValues('color', undefined);
                setColorKey(nanoid());
              } else {
                updateValues('color', value);
              }
            }}
            onBlur={() => {
              updateTouched('color', true);
              validate();
            }}
            isTouched={touched.color}
            error={errors.color?.message}
            groups={[
              {
                id: 'no-selection',
                label: '',
                options: [
                  {
                    value: 'none',
                    label: (
                      <ColorLabel>
                        <span
                          style={{
                            backgroundColor: 'transparent',
                          }}
                        />
                        <TruncatedText>No Selection</TruncatedText>
                      </ColorLabel>
                    ),
                  },
                ],
              },
              {
                id: 'standard-colors',
                label: 'Standard Colors',
                options: standardColorSelectOptions.map(({ value, label }) => ({
                  value,
                  label: (
                    <ColorLabel>
                      <span
                        style={{
                          backgroundColor: colorCodes[value],
                        }}
                      />
                      <TruncatedText>{label}</TruncatedText>
                    </ColorLabel>
                  ),
                })),
              },
              {
                id: 'non-standard-colors',
                label: 'Additional Colors',
                options: nonStandardColorSelectOptions.map(
                  ({ value, label }) => ({
                    value,
                    label: (
                      <ColorLabel>
                        <span
                          style={{
                            backgroundColor: colorCodes[value],
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
          {feature.geometry.type === GeometryTypeNames.Point && (
            <SelectField
              key={symbolKey}
              name='symbol'
              placeholder='Symbol'
              value={values.symbol}
              onChange={(value) => {
                if (value === 'none') {
                  updateValues('symbol', undefined);
                  setSymbolKey(nanoid());
                } else {
                  updateValues('symbol', value);
                }
              }}
              onBlur={() => {
                updateTouched('symbol', true);
                validate();
              }}
              isTouched={touched.symbol}
              error={errors.symbol?.message}
              groups={[
                {
                  id: 'no-selection',
                  label: '',
                  options: [
                    {
                      value: 'none',
                      label: (
                        <SymbolLabel>
                          <NoneSymbol />
                          <TruncatedText>No Selection</TruncatedText>
                        </SymbolLabel>
                      ),
                    },
                  ],
                },
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
          <TextareaField
            rows={4}
            name='description'
            placeholder='Description'
            value={values.description}
            onChange={(e) => {
              updateValues('description', e.target.value);
            }}
            onBlur={() => {
              updateTouched('description', true);
              validate();
            }}
            isTouched={touched.description}
            error={errors.description?.message}
          />
        </FieldsGrid>
      </Flex>
      <Flex justifyContent='end' width='full'>
        <Button
          type='button' // prevent early submission of RouteForm
          variant='solid'
          size='lg'
          aria-label='Update feature properties'
          onClick={onSubmit}
        >
          Update
        </Button>
      </Flex>
    </StyledFeatureEdit>
  );
};

const StyledFeatureEdit = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$4',
  width: 'full',
});

const StatusWrapper = styled('div', {
  width: '$full',
  textAlign: 'center',
});

const FieldsGrid = styled('div', {
  display: 'grid',
  gap: '$2',
  width: '$full',
});

const CoordinatesFieldsGrid = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '$1',
  alignItems: 'start',
  width: '$full',
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

const NoneSymbol = styled('div', {
  width: '$4',
  height: '$4',
  backgroundColor: 'transparent',
});
