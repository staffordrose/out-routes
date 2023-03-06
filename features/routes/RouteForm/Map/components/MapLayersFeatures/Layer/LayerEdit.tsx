import { FC, useState } from 'react';
import NextImage from 'next/image';
import { UseFieldArrayUpdate } from 'react-hook-form';
import * as yup from 'yup';

import { Button, Flex, Text, TruncatedText } from '@/components/atoms';
import { SelectField, TextField } from '@/components/molecules';
import { colorSelectOptions } from '@/data/general';
import { symbolSelectOptions } from '@/data/routes';
import { styled } from '@/styles';
import { LayerValues, RouteFormValues } from '../../../../helpers';

const yupSchema = yup.object({
  title: yup.string().max(60, `Can't be longer than 60 characters`),
  color: yup.string(),
  symbol: yup.string(),
});

type Key = 'title' | 'color' | 'symbol';

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
  const [status, setStatus] = useState('');

  const [values, setValues] = useState<Record<Key, string>>({
    title: layer.title,
    color: layer.color,
    symbol: layer.symbol,
  });

  const [touched, setTouched] = useState<Record<Key, boolean>>({
    title: false,
    color: false,
    symbol: false,
  });

  const [errors, setErrors] = useState<Record<Key, yup.ValidationError | null>>(
    {
      title: null,
      color: null,
      symbol: null,
    }
  );

  const updateValues = (
    property: Key,
    value: typeof values.title | typeof values.color | typeof values.symbol
  ) => {
    setValues((prev) => ({
      ...prev,
      [property]: value,
    }));
  };

  const updateTouched = (property: Key, value: boolean) => {
    setTouched((prev) => ({
      ...prev,
      [property]: value,
    }));
  };

  const updateErrors = (property: Key, value: yup.ValidationError | null) => {
    setErrors((prev) => ({
      ...prev,
      [property]: value,
    }));
  };

  const validate = async () => {
    for (const value in values) {
      try {
        await yupSchema.validateAt(value, values);

        if (errors[value as Key]) {
          updateErrors(value as Key, null);
        }
      } catch (error) {
        if (error instanceof yup.ValidationError) {
          updateErrors(value as Key, error);
        }
      }
    }
  };

  const onSubmit = async () => {
    try {
      setStatus('');

      await validate();

      if (Object.values(errors).some((error) => error !== null)) {
        throw new Error('Something went wrong submitting the form');
      }

      update(layerIndex, {
        ...layer,
        title: values.title,
        color: values.color,
        symbol: values.symbol,
      });
    } catch (error) {
      if (error instanceof Error) {
        setStatus(error.message);
      }
    }
  };

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
          label='Name'
          placeholder='Approach'
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
        <SelectField
          name='color'
          label='Color'
          placeholder='Color'
          value={values.color}
          onChange={(value) => {
            updateValues('color', value);
          }}
          onBlur={() => {
            updateTouched('color', true);
            validate();
          }}
          isTouched={touched.color}
          error={errors.color?.message}
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
        <SelectField
          name='symbol'
          label='Symbol'
          placeholder='Symbol'
          value={values.symbol}
          onChange={(value) => {
            updateValues('symbol', value);
          }}
          onBlur={() => {
            updateTouched('symbol', true);
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
  display: 'grid',
  gap: '$4',
  width: '$full',
});

const StatusWrapper = styled('div', {
  width: '$full',
  paddingY: '$4',
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
