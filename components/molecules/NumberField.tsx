import {
  ComponentPropsWithoutRef,
  ForwardedRef,
  forwardRef,
  ReactNode,
} from 'react';
import ReactIs from 'react-is';

import { styled } from '@/styles';
import { Input, Label, Text } from '../atoms';

export type NumberFieldProps = ComponentPropsWithoutRef<typeof Input> & {
  label?: ReactNode;
  isTouched?: boolean;
  error?: string;
};

export const NumberField = forwardRef(
  (
    { label, isTouched, error, ...inputProps }: NumberFieldProps,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const isError = isTouched && !!error;

    return (
      <StyledNumberField>
        {ReactIs.isValidElementType(label) && (
          <Label htmlFor={inputProps.id || inputProps.name}>{label}</Label>
        )}
        <Input ref={ref} type='number' {...inputProps} isError={isError} />
        {isError && (
          <Text fontSize='sm' color='red-700'>
            {error}
          </Text>
        )}
      </StyledNumberField>
    );
  }
);

NumberField.displayName = 'NumberField';

const StyledNumberField = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  flexWrap: 'wrap',
  gap: '$1',
  justifyContent: 'center',
  width: '$full',
});
