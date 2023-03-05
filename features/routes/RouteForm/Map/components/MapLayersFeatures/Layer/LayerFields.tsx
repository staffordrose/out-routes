import { FC } from 'react';
import NextImage from 'next/image';
import { Controller, useFormContext } from 'react-hook-form';

import { TruncatedText } from '@/components/atoms';
import { SelectField, TextField } from '@/components/molecules';
import { colorSelectOptions } from '@/data/general';
import { symbolSelectOptions } from '@/data/routes';
import { styled } from '@/styles';
import { RouteFormValues } from '../../../../helpers';

type LayerFieldsProps = {
  layerIndex: number;
};

export const LayerFields: FC<LayerFieldsProps> = ({ layerIndex }) => {
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
  position: 'sticky',
  top: 'calc($14 + $12)',
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax($56, 1fr))',
  gap: '$2',
  width: '$full',
  minHeight: '$12',
  padding: '$2',
  paddingLeft: '$3_5',
  borderBottomWidth: '$1',
  borderBottomStyle: 'solid',
  borderBottomColor: '$slate-300',
  backgroundColor: '$white',
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
