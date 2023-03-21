import { FC } from 'react';
import NextImage from 'next/image';
import { UseFieldArrayUpdate } from 'react-hook-form';

import { Button, Flex, Text, TruncatedText } from '@/components/atoms';
import { SelectField, TextField } from '@/components/molecules';
import {
  colorCodes,
  nonStandardColorSelectOptions,
  standardColorSelectOptions,
} from '@/data/general';
import { symbolSelectOptions } from '@/data/routes';
import { styled } from '@/styles';
import { LayerValues, RouteFormValues } from '../../../../../../helpers';
import { useLayerEditForm } from './hooks';

type LayerEditProps = {
  update: UseFieldArrayUpdate<RouteFormValues, 'layers'>;
  layerIndex: number;
  layer: LayerValues;
};

export const LayerEdit: FC<LayerEditProps> = ({
  update,
  layerIndex,
  layer,
}) => {
  const {
    status,
    values,
    touched,
    errors,
    setValues,
    setTouched,
    validate,
    onSubmit,
  } = useLayerEditForm({
    update,
    layerIndex,
    layer,
  });

  return (
    <StyledLayerEdit>
      {!!status && (
        <StatusWrapper>
          <Text color='red-700'>{status}</Text>
        </StatusWrapper>
      )}
      <FieldsGrid>
        <TextField
          name='title'
          placeholder='Name'
          value={values.title}
          onChange={(e) => {
            setValues('title', e.target.value);
          }}
          onBlur={() => {
            setTouched('title', true);
            validate();
          }}
          isTouched={touched.title}
          error={errors.title?.message}
        />
        <SelectField
          name='color'
          placeholder='Color'
          value={values.color}
          onChange={(value) => {
            setValues('color', value);
          }}
          onBlur={() => {
            setTouched('color', true);
            validate();
          }}
          isTouched={touched.color}
          error={errors.color?.message}
          groups={[
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
        <SelectField
          name='symbol'
          placeholder='Symbol'
          value={values.symbol}
          onChange={(value) => {
            setValues('symbol', value);
          }}
          onBlur={() => {
            setTouched('symbol', true);
            validate();
          }}
          isTouched={touched.symbol}
          error={errors.symbol?.message}
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
      </FieldsGrid>
      <Flex justifyContent='end' width='full'>
        <Button
          type='button' // prevent early submission of RouteForm
          variant='solid'
          size='lg'
          aria-label='Update section properties'
          onClick={onSubmit}
        >
          Update
        </Button>
      </Flex>
    </StyledLayerEdit>
  );
};

const StyledLayerEdit = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$4',
  width: '$full',
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
