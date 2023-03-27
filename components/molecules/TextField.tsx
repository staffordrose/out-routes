import {
  ComponentPropsWithoutRef,
  ForwardedRef,
  forwardRef,
  ReactNode,
} from 'react';
import ReactIs from 'react-is';

import { styled } from '@/styles';
import { Input, Label, Text } from '../atoms';

export type TextFieldProps = ComponentPropsWithoutRef<typeof Input> & {
  label?: ReactNode;
  isTouched?: boolean;
  error?: string;
};

export const TextField = forwardRef(
  (
    { label, isTouched, error, ...inputProps }: TextFieldProps,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const isError = isTouched && !!error;

    return (
      <StyledTextField>
        {ReactIs.isValidElementType(label) && (
          <Label htmlFor={inputProps.id || inputProps.name}>{label}</Label>
        )}
        <Input ref={ref} type='text' {...inputProps} isError={isError} />
        {isError && (
          <Text fontSize='sm' color='red-700'>
            {error}
          </Text>
        )}
      </StyledTextField>
    );
  }
);

TextField.displayName = 'TextField';

const StyledTextField = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  flexWrap: 'wrap',
  gap: '$1',
  justifyContent: 'center',
  width: '$full',
});
