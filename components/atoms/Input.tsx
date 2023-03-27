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
  isError?: boolean;
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
  borderWidth: '$1',
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
    outlineWidth: '$1',
    outlineStyle: 'solid',
    outlineColor: '$blue-300',
    backgroundColor: '$slate-50',
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
  defaultVariants: {
    size: 'sm',
  },
});
