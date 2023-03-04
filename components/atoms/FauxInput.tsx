import {
  ComponentPropsWithoutRef,
  ElementType,
  ForwardedRef,
  forwardRef,
} from 'react';
import type * as Stitches from '@stitches/react';

import { styled } from '@/styles';

export type FauxInputProps = ComponentPropsWithoutRef<
  typeof StyledFauxInput
> & {
  as?: ElementType;
  css?: Stitches.CSS;
};

export const FauxInput = forwardRef(
  (props: FauxInputProps, ref: ForwardedRef<HTMLButtonElement>) => {
    return <StyledFauxInput {...props} ref={ref} />;
  }
);

FauxInput.displayName = 'FauxInput';

const StyledFauxInput = styled('button', {
  all: 'unset',
  boxSizing: 'border-box',
  display: 'inline-flex',
  alignItems: 'center',
  width: '$48',
  height: '$9',
  padding: '0 $2',
  borderWidth: '$1',
  borderStyle: 'solid',
  borderColor: '$slate-300',
  borderRadius: '$md',
  fontSize: '$md',
  lineHeight: '$xs',
  textAlign: 'left',
  color: '$slate-600',
  backgroundColor: 'transparent',
  cursor: 'pointer',
  userSelect: 'none',
  '&:hover': {
    borderColor: '$slate-700',
    backgroundColor: '$slate-50',
  },
  '&:focus': {
    borderColor: '$slate-700',
    backgroundColor: '$slate-50',
    outlineWidth: '$1',
    outlineStyle: 'solid',
    outlineColor: '$blue-300',
  },
});
