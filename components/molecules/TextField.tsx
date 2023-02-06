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
    return (
      <StyledTextField>
        {ReactIs.isValidElementType(label) && (
          <Label htmlFor={inputProps.id || inputProps.name}>{label}</Label>
        )}
        <Input ref={ref} type='text' {...inputProps} />
        {isTouched && !!error && <Text color='red-700'>{error}</Text>}
      </StyledTextField>
    );
  }
);

TextField.displayName = 'TextField';

const StyledTextField = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  flexWrap: 'wrap',
  justifyContent: 'center',
  width: '$full',
});
