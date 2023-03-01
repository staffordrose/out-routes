import { FC, useState } from 'react';
import NextImage from 'next/image';
import { UseFieldArrayUpdate } from 'react-hook-form';
import * as yup from 'yup';
import { nanoid } from 'nanoid';
import { BiX } from 'react-icons/bi';

import {
  Button,
  Flex,
  IconButton,
  Text,
  TruncatedText,
} from '@/components/atoms';
import { SelectField, TextareaField, TextField } from '@/components/molecules';
import { colorSelectOptions } from '@/data/general';
import { GeometryTypeNames, symbolSelectOptions } from '@/data/routes';
import { styled } from '@/styles';
import { MapFeature, MapLayer } from '@/types';
import { trimFeatureSymbolCode } from '@/utils';
import { RouteFormValues } from '../../../helpers';
import { updateLayerFeature } from '../../helpers';

const yupSchema = yup.object({
  title: yup.string().max(60, `Can't be longer than 60 characters`),
  color: yup.string().nullable(),
  symbol: yup.string().nullable(),
  description: yup.string().max(280, `Can't be longer than 280 characters`),
});

type Key = 'title' | 'color' | 'symbol' | 'description';

type PopupEditProps = {
  update: UseFieldArrayUpdate<RouteFormValues, 'layers'>;
  layers: RouteFormValues['layers'];
  activeLayerId: MapLayer['id'] | null;
  feature: MapFeature;
  viewFeatureDetail: () => void;
  closePopup: () => void;
};

export const PopupEdit: FC<PopupEditProps> = ({
  update,
  layers,
  activeLayerId,
  feature,
  viewFeatureDetail,
  closePopup,
}) => {
  const [status, setStatus] = useState('');

  // key is changed when user removes selection
  const [colorKey, setColorKey] = useState(nanoid());
  const [symbolKey, setSymbolKey] = useState(nanoid());

  const [values, setValues] = useState<Record<Key, string | undefined>>({
    title: feature.properties.title || '',
    color: feature.properties.color || undefined,
    symbol: trimFeatureSymbolCode(feature.properties.symbol) || undefined,
    description: feature.properties.description || '',
  });

  const [touched, setTouched] = useState<Record<Key, boolean>>({
    title: false,
    color: false,
    symbol: false,
    description: false,
  });

  const [errors, setErrors] = useState<Record<Key, yup.ValidationError | null>>(
    {
      title: null,
      color: null,
      symbol: null,
      description: null,
    }
  );

  const updateValues = (
    property: Key,
    value:
      | typeof values.title
      | typeof values.color
      | typeof values.symbol
      | typeof values.description
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

      updateLayerFeature(update, layers, activeLayerId, {
        ...feature,
        properties: {
          ...feature.properties,
          title: values.title,
          color: values.color,
          symbol: values.symbol,
          description: values.description,
        },
      });

      closePopup();
    } catch (error) {
      if (error instanceof Error) {
        setStatus(error.message);
      }
    }
  };

  return (
    <FauxForm>
      <Flex direction='column' gap='sm' width='full'>
        <Flex
          gap='sm'
          justifyContent='space-between'
          alignItems='center'
          width='full'
        >
          <h5>{values.title || '[Untitled feature]'}</h5>
          <IconButton
            variant='ghost'
            size='xs'
            aria-label='Go back to feature detail'
            onClick={viewFeatureDetail}
            css={{ flexShrink: 0 }}
          >
            <BiX />
          </IconButton>
        </Flex>

        {!!status && (
          <StatusWrapper>
            <Text color='red-700'>{status}</Text>
          </StatusWrapper>
        )}

        <Flex direction='column' gap='xs' width='full'>
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
                id: 'colors',
                label: 'Colors',
                options: [
                  { value: 'none', label: <span>No selection</span> },
                  ...colorSelectOptions,
                ].map(({ value, label }) => ({
                  value,
                  label: (
                    <ColorLabel>
                      <span
                        style={{
                          backgroundColor:
                            value !== 'none' ? value : 'transparent',
                        }}
                      />
                      <TruncatedText>{label}</TruncatedText>
                    </ColorLabel>
                  ),
                })),
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
                  id: 'symbols',
                  label: 'Symbols',
                  options: [
                    { value: 'none', label: <span>No selection</span> },
                    ...symbolSelectOptions,
                  ].map(({ value, label }) => ({
                    value,
                    label: (
                      <SymbolLabel>
                        {value !== 'none' ? (
                          <NextImage
                            src={`/symbols/${value}.svg`}
                            height={16}
                            width={16}
                            alt={`${label} Icon`}
                          />
                        ) : (
                          <NoneSymbol />
                        )}
                        <TruncatedText>{label}</TruncatedText>
                      </SymbolLabel>
                    ),
                  })),
                },
              ]}
            />
          )}
          <TextareaField
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
        </Flex>
      </Flex>
      <Button
        variant='solid'
        type='button' // prevent early submission of RouteForm
        aria-label='Update feature properties'
        onClick={onSubmit}
      >
        Update
      </Button>
    </FauxForm>
  );
};

const FauxForm = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$1',
  justifyContent: 'space-between',
  width: 'full',
  height: 'full',
  minHeight: 236,
});

const StatusWrapper = styled('div', {
  width: '$full',
  paddingY: '$4',
  textAlign: 'center',
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
