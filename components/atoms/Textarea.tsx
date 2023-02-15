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
  borderWidth: '$2',
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
    outlineWidth: '$2',
    outlineStyle: 'dashed',
    outlineColor: '$slate-500',
  },
  '&:disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
});
