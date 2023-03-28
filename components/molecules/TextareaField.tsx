import {
  ComponentPropsWithoutRef,
  ForwardedRef,
  forwardRef,
  ReactNode,
} from 'react';
import ReactIs from 'react-is';

import { styled } from '@/styles';
import { Label, Text, Textarea } from '../atoms';

export type TextareaFieldProps = ComponentPropsWithoutRef<typeof Textarea> & {
  isRequired?: boolean;
  label?: ReactNode;
  rows?: number;
  isTouched?: boolean;
  error?: string;
};

export const TextareaField = forwardRef(
  (
    {
      isRequired,
      label,
      isTouched,
      error,
      ...textareaProps
    }: TextareaFieldProps,
    ref: ForwardedRef<HTMLTextAreaElement>
  ) => {
    const isError = isTouched && !!error;

    return (
      <StyledTextareaField>
        {ReactIs.isValidElementType(label) && (
          <Label htmlFor={textareaProps.id || textareaProps.name}>
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
        <Textarea ref={ref} {...textareaProps} isError={isError} />
        {isError && (
          <Text fontSize='sm' colorScheme='red' colorScale={700}>
            {error}
          </Text>
        )}
      </StyledTextareaField>
    );
  }
);

TextareaField.displayName = 'TextareaField';

const StyledTextareaField = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  flexWrap: 'wrap',
  gap: '$1',
  justifyContent: 'center',
  width: '$full',
});
