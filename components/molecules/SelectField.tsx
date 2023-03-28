import {
  ComponentPropsWithoutRef,
  ForwardedRef,
  forwardRef,
  ReactNode,
} from 'react';
import ReactIs from 'react-is';

import { styled } from '@/styles';
import { Label, Select, Text } from '../atoms';

export type SelectFieldProps = ComponentPropsWithoutRef<typeof Select> & {
  id?: string;
  isRequired?: boolean;
  label?: ReactNode;
  placeholder?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  isTouched?: boolean;
  error?: string;
};

export const SelectField = forwardRef(
  (
    {
      isRequired,
      label,
      onChange,
      onBlur,
      isTouched,
      error,
      ...selectProps
    }: SelectFieldProps,
    ref: ForwardedRef<HTMLButtonElement>
  ) => {
    const isError = isTouched && !!error;

    return (
      <StyledSelectField>
        {ReactIs.isValidElementType(label) && (
          <Label htmlFor={selectProps.id || selectProps.name}>
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
        <Select
          ref={ref}
          {...selectProps}
          onValueChange={onChange}
          onOpenChange={(open) => {
            if (typeof onBlur === 'function' && open === false) {
              onBlur();
            }
          }}
          isError={isError}
        />
        {isError && (
          <Text fontSize='sm' colorScheme='red' colorScale={700}>
            {error}
          </Text>
        )}
      </StyledSelectField>
    );
  }
);

SelectField.displayName = 'SelectField';

const StyledSelectField = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  flexWrap: 'wrap',
  gap: '$1',
  justifyContent: 'center',
  width: '$full',
});
