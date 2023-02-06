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
  label?: ReactNode;
  rows?: number;
  isTouched?: boolean;
  error?: string;
};

export const TextareaField = forwardRef(
  (
    { label, isTouched, error, ...textareaProps }: TextareaFieldProps,
    ref: ForwardedRef<HTMLTextAreaElement>
  ) => {
    return (
      <StyledTextareaField>
        {ReactIs.isValidElementType(label) && (
          <Label htmlFor={textareaProps.id || textareaProps.name}>
            {label}
          </Label>
        )}
        <Textarea ref={ref} {...textareaProps} />
        {isTouched && !!error && <Text color='red-700'>{error}</Text>}
      </StyledTextareaField>
    );
  }
);

TextareaField.displayName = 'TextareaField';

const StyledTextareaField = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  flexWrap: 'wrap',
  justifyContent: 'center',
  width: '$full',
});
