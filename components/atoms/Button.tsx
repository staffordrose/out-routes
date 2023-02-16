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
  paddingY: '$0_5',
  borderWidth: '$2',
  borderStyle: 'solid',
  borderRadius: '$md',
  fontFamily: '$heading',
  fontWeight: '$medium',
  lineHeight: '$sm',
  cursor: 'pointer',
  userSelect: 'none',
  variants: {
    variant: {
      solid: {
        borderColor: '$slate-500',
        color: '$slate-50',
        backgroundColor: '$slate-700',
        '&:hover:enabled': {
          borderStyle: 'dashed',
          backgroundColor: '$slate-800',
        },
        '&:focus:enabled': {
          borderStyle: 'dashed',
          backgroundColor: '$slate-900',
        },
        '&:disabled': {
          opacity: 0.5,
          cursor: 'not-allowed',
        },
      },
      outline: {
        borderColor: '$slate-500',
        color: '$slate-900',
        backgroundColor: '$slate-50',
        '&:hover:enabled': {
          borderStyle: 'dashed',
          backgroundColor: '$slate-200',
        },
        '&:focus:enabled': {
          borderStyle: 'dashed',
          backgroundColor: '$slate-300',
        },
        '&:disabled': {
          opacity: 0.5,
          cursor: 'not-allowed',
        },
      },
      ghost: {
        borderStyle: 'dashed',
        borderColor: 'transparent',
        color: '$slate-900',
        backgroundColor: 'transparent',
        '&:hover:enabled': {
          borderColor: '$slate-500',
        },
        '&:focus:enabled': {
          borderColor: '$slate-500',
          backgroundColor: '$slate-200',
        },
        '&:disabled': {
          opacity: 0.5,
          cursor: 'not-allowed',
        },
      },
    },
    size: {
      xs: {
        gap: '$2',
        minHeight: '$7',
        paddingX: '$2',
        fontSize: '$sm',
        '& > svg': {
          flexShrink: 0,
          width: '$5',
          height: '$5',
        },
      },
      sm: {
        gap: '$2',
        minHeight: '$8',
        paddingX: '$2',
        fontSize: '$md',
        '& > svg': {
          flexShrink: 0,
          width: '$6',
          height: '$6',
        },
      },
      md: {
        gap: '$2_5',
        minHeight: '$10',
        paddingX: '$2_5',
        fontSize: '$lg',
        '& > svg': {
          flexShrink: 0,
          width: '$7',
          height: '$7',
        },
      },
      lg: {
        gap: '$3',
        minHeight: '$12',
        paddingX: '$3',
        fontSize: '$xl',
        '& > svg': {
          flexShrink: 0,
          width: '$8',
          height: '$8',
        },
      },
      xl: {
        gap: '$3_5',
        minHeight: '$14',
        paddingX: '$3_5',
        fontSize: '$2xl',
        '& > svg': {
          flexShrink: 0,
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
