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
  isRequired?: boolean;
  label?: ReactNode;
  isTouched?: boolean;
  error?: string;
};

export const TextField = forwardRef(
  (
    { isRequired, label, isTouched, error, ...inputProps }: TextFieldProps,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const isError = isTouched && !!error;

    return (
      <StyledTextField>
        {ReactIs.isValidElementType(label) && (
          <Label htmlFor={inputProps.id || inputProps.name}>
            {label}
            {!isRequired ? (
              <Text
                as='span'
                fontSize='sm'
                fontStyle='italic'
                colorScheme='slate'
                colorScale={500}
              >
                {' - '}
                <span>Optional</span>
              </Text>
            ) : null}
          </Label>
        )}
        <Input ref={ref} type='text' {...inputProps} isError={isError} />
        {isError && (
          <Text fontSize='sm' colorScheme='red' colorScale={700}>
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
