import {
  ComponentPropsWithoutRef,
  ElementType,
  ForwardedRef,
  forwardRef,
} from 'react';
import type * as Stitches from '@stitches/react';

import { styled } from '@/styles';

export type InputProps = ComponentPropsWithoutRef<typeof StyledInput> & {
  as?: ElementType;
  css?: Stitches.CSS;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
};

export const Input = forwardRef(
  (props: InputProps, ref: ForwardedRef<HTMLInputElement>) => {
    return <StyledInput {...props} ref={ref} />;
  }
);

Input.displayName = 'Input';

const StyledInput = styled('input', {
  all: 'unset',
  boxSizing: 'border-box',
  display: 'inline-flex',
  alignItems: 'center',
  width: '$full',
  padding: '0 $2',
  borderWidth: '$2',
  borderStyle: 'solid',
  borderColor: '$slate-300',
  borderRadius: '$md',
  lineHeight: '$xs',
  textAlign: 'left',
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
  variants: {
    size: {
      xs: {
        height: '$7',
        fontSize: '$sm',
      },
      sm: {
        height: '$8',
        fontSize: '$md',
      },
      md: {
        height: '$10',
        fontSize: '$lg',
      },
      lg: {
        height: '$12',
        fontSize: '$xl',
      },
      xl: {
        height: '$14',
        fontSize: '$2xl',
      },
    },
  },
  defaultVariants: {
    size: 'sm',
  },
});
