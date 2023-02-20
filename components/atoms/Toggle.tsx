import {
  ComponentPropsWithoutRef,
  ElementType,
  ForwardedRef,
  forwardRef,
} from 'react';
import * as RadixToggle from '@radix-ui/react-toggle';
import type * as Stitches from '@stitches/react';

import { styled } from '@/styles';

export type ToggleProps = ComponentPropsWithoutRef<typeof StyledToggle> & {
  as?: ElementType;
  css?: Stitches.CSS;
  variant?: 'solid' | 'outline' | 'ghost';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
};

export const Toggle = forwardRef(
  (props: ToggleProps, ref: ForwardedRef<HTMLButtonElement>) => {
    return <StyledToggle {...props} ref={ref} />;
  }
);

Toggle.displayName = 'Toggle';

const StyledToggle = styled(RadixToggle.Root, {
  all: 'unset',
  boxSizing: 'border-box',
  display: 'flex',
  placeItems: 'center',
  borderWidth: '$2',
  borderStyle: 'solid',
  borderRadius: '$md',
  fontWeight: '$medium',
  lineHeight: '$xs',
  cursor: 'pointer',
  userSelect: 'none',
  variants: {
    variant: {
      solid: {
        borderColor: '$slate-500',
        color: '$slate-50',
        backgroundColor: '$slate-600',
        '&:hover:enabled': {
          borderStyle: 'dashed',
          backgroundColor: '$slate-700',
        },
        '&[data-state=on]:enabled': {
          borderStyle: 'dashed',
          backgroundColor: '$slate-900',
        },
        '&:focus:enabled': {
          borderStyle: 'dashed',
          backgroundColor: '$slate-800',
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
        '&[data-state=on]:enabled': {
          borderStyle: 'dashed',
          backgroundColor: '$slate-400',
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
          backgroundColor: '$slate-100',
        },
        '&[data-state=on]:enabled': {
          borderStyle: 'dashed',
          backgroundColor: '$slate-300',
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
        width: '$7',
        height: '$7',
        '& > svg': {
          width: '$5',
          height: '$5',
        },
      },
      sm: {
        width: '$8',
        height: '$8',
        '& > svg': {
          width: '$6',
          height: '$6',
        },
      },
      md: {
        width: '$10',
        height: '$10',
        '& > svg': {
          width: '$7',
          height: '$7',
        },
      },
      lg: {
        width: '$12',
        height: '$12',
        '& > svg': {
          width: '$8',
          height: '$8',
        },
      },
      xl: {
        width: '$14',
        height: '$14',
        '& > svg': {
          width: '$9',
          height: '$9',
        },
      },
    },
  },
  defaultVariants: {
    variant: 'outline',
    size: 'sm',
  },
});
