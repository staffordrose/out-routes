import {
  ComponentPropsWithoutRef,
  ElementType,
  ForwardedRef,
  forwardRef,
} from 'react';
import type * as Stitches from '@stitches/react';

import { styled } from '@/styles';

export type TextareaProps = ComponentPropsWithoutRef<typeof StyledTextarea> & {
  as?: ElementType;
  css?: Stitches.CSS;
  rows?: number;
  isError?: boolean;
};

export const Textarea = forwardRef(
  (
    { rows = 1, ...textareaProps }: TextareaProps,
    ref: ForwardedRef<HTMLTextAreaElement>
  ) => {
    return <StyledTextarea {...textareaProps} ref={ref} rows={rows} />;
  }
);

Textarea.displayName = 'Textarea';

const StyledTextarea = styled('textarea', {
  all: 'unset',
  boxSizing: 'border-box',
  resize: 'vertical',
  width: '$full',
  padding: '$2',
  borderWidth: '$1',
  borderStyle: 'solid',
  borderColor: '$slate-300',
  borderRadius: '$md',
  fontSize: '$md',
  lineHeight: '$xs',
  color: '$slate-900',
  backgroundColor: 'transparent',
  cursor: 'text',
  '&:hover:enabled': {
    borderColor: '$slate-700',
    backgroundColor: '$slate-50',
  },
  '&:focus:enabled': {
    borderColor: '$slate-700',
    backgroundColor: '$slate-50',
    outlineWidth: '$1',
    outlineStyle: 'solid',
    outlineColor: '$blue-300',
  },
  '&:disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  variants: {
    isError: {
      true: {
        borderColor: '$red-700',
        backgroundColor: '$red-50',
        '&:hover:enabled': {
          borderColor: '$red-700',
          backgroundColor: '$white',
        },
        '&:focus:enabled': {
          borderColor: '$red-700',
          outlineWidth: '$1',
          outlineStyle: 'solid',
          outlineColor: '$red-300',
          backgroundColor: '$white',
        },
      },
    },
  },
});
