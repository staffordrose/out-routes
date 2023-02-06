import {
  ComponentPropsWithoutRef,
  ElementType,
  ForwardedRef,
  forwardRef,
} from 'react';
import type * as Stitches from '@stitches/react';

import { styled } from '@/styles';

export type ButtonProps = ComponentPropsWithoutRef<typeof StyledButton> & {
  as?: ElementType;
  css?: Stitches.CSS;
  variant?: 'solid' | 'outline' | 'ghost';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  display?: 'flex' | 'inline-flex';
};

export const Button = forwardRef(
  (props: ButtonProps, ref: ForwardedRef<HTMLButtonElement>) => {
    return <StyledButton {...props} ref={ref} />;
  }
);

Button.displayName = 'Button';

const StyledButton = styled('button', {
  all: 'unset',
  boxSizing: 'border-box',
  placeItems: 'center',
  width: '$auto',
  height: '$auto',
  borderWidth: '$2',
  borderStyle: 'solid',
  borderRadius: '$md',
  fontFamily: '$heading',
  fontWeight: '$medium',
  lineHeight: '$xs',
  cursor: 'pointer',
  userSelect: 'none',
  variants: {
    variant: {
      solid: {
        borderColor: '$slate-500',
        color: '$slate-50',
        backgroundColor: '$slate-700',
        '&:hover': {
          borderStyle: 'dashed',
          backgroundColor: '$slate-800',
        },
        '&:focus': {
          borderStyle: 'dashed',
          backgroundColor: '$slate-900',
        },
        '&:disabled': {
          borderStyle: 'solid',
          backgroundColor: '$slate-700',
          opacity: 0.5,
          cursor: 'not-allowed',
        },
      },
      outline: {
        borderColor: '$slate-500',
        color: '$slate-900',
        backgroundColor: '$slate-50',
        '&:hover': {
          borderStyle: 'dashed',
          backgroundColor: '$slate-200',
        },
        '&:focus': {
          borderStyle: 'dashed',
          backgroundColor: '$slate-300',
        },
        '&:disabled': {
          borderStyle: 'solid',
          backgroundColor: '$slate-50',
          opacity: 0.5,
          cursor: 'not-allowed',
        },
      },
      ghost: {
        borderStyle: 'dashed',
        borderColor: 'transparent',
        color: '$slate-900',
        backgroundColor: 'transparent',
        '&:hover': {
          borderColor: '$slate-500',
        },
        '&:focus': {
          borderColor: '$slate-500',
          backgroundColor: '$slate-200',
        },
        '&:disabled': {
          borderColor: 'transparent',
          backgroundColor: 'transparent',
          opacity: 0.5,
          cursor: 'not-allowed',
        },
      },
    },
    size: {
      xs: {
        gap: '$2',
        minHeight: '$7',
        padding: '0 $2',
        fontSize: '$sm',
        '& > svg': {
          width: '$5',
          height: '$5',
        },
      },
      sm: {
        gap: '$2',
        minHeight: '$8',
        padding: '0 $2',
        fontSize: '$md',
        '& > svg': {
          width: '$6',
          height: '$6',
        },
      },
      md: {
        gap: '$2_5',
        minHeight: '$10',
        padding: '0 $2_5',
        fontSize: '$lg',
        '& > svg': {
          width: '$7',
          height: '$7',
        },
      },
      lg: {
        gap: '$3',
        minHeight: '$12',
        padding: '0 $3',
        fontSize: '$xl',
        '& > svg': {
          width: '$8',
          height: '$8',
        },
      },
      xl: {
        gap: '$3_5',
        minHeight: '$14',
        padding: '0 $3_5',
        fontSize: '$2xl',
        '& > svg': {
          width: '$9',
          height: '$9',
        },
      },
    },
    display: {
      flex: { display: 'flex' },
      'inline-flex': { display: 'inline-flex' },
    },
  },
  defaultVariants: {
    variant: 'outline',
    size: 'sm',
    display: 'inline-flex',
  },
});
