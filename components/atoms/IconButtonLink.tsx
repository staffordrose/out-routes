import { ComponentPropsWithoutRef, ForwardedRef, forwardRef } from 'react';
import NextLink from 'next/link';
import type * as Stitches from '@stitches/react';

import { styled } from '@/styles';

export type IconButtonLinkProps = ComponentPropsWithoutRef<
  typeof StyledIconButtonLink
> & {
  css?: Stitches.CSS;
  variant?: 'solid' | 'outline' | 'ghost';
  colorScheme?:
    | 'slate'
    | 'red'
    | 'orange'
    | 'yellow'
    | 'green'
    | 'blue'
    | 'purple';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  borderRadius?: 'normal' | 'full';
};

export const IconButtonLink = forwardRef(
  (props: IconButtonLinkProps, ref: ForwardedRef<HTMLAnchorElement>) => {
    return <StyledIconButtonLink {...props} ref={ref} />;
  }
);

IconButtonLink.displayName = 'IconButtonLink';

const StyledIconButtonLink = styled(NextLink, {
  all: 'unset',
  boxSizing: 'border-box',
  display: 'flex',
  placeItems: 'center',
  overflow: 'hidden',
  borderWidth: '$2',
  borderStyle: 'solid',
  fontWeight: '$medium',
  lineHeight: '$xs',
  cursor: 'pointer',
  userSelect: 'none',
  variants: {
    variant: {
      solid: {
        '&:hover': {
          borderStyle: 'dashed',
        },
        '&:focus': {
          borderStyle: 'dashed',
        },
      },
      outline: {
        '&:hover': {
          borderStyle: 'dashed',
        },
        '&:focus': {
          borderStyle: 'dashed',
        },
      },
      ghost: {
        borderStyle: 'dashed',
        borderColor: 'transparent',
        backgroundColor: 'transparent',
      },
    },
    colorScheme: {
      slate: {},
      red: {},
      orange: {},
      yellow: {},
      green: {},
      blue: {},
      purple: {},
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
    borderRadius: {
      normal: { borderRadius: '$md' },
      full: { borderRadius: '$full' },
    },
  },
  compoundVariants: [
    {
      variant: 'solid',
      colorScheme: 'slate',
      css: {
        borderColor: '$slate-500',
        color: '$slate-50',
        backgroundColor: '$slate-600',
        '&:hover': {
          backgroundColor: '$slate-700',
        },
        '&:focus': {
          backgroundColor: '$slate-800',
        },
      },
    },
    {
      variant: 'solid',
      colorScheme: 'red',
      css: {
        borderColor: '$red-500',
        color: '$red-50',
        backgroundColor: '$red-600',
        '&:hover': {
          backgroundColor: '$red-700',
        },
        '&:focus': {
          backgroundColor: '$red-800',
        },
      },
    },
    {
      variant: 'solid',
      colorScheme: 'orange',
      css: {
        borderColor: '$orange-500',
        color: '$orange-50',
        backgroundColor: '$orange-600',
        '&:hover': {
          backgroundColor: '$orange-700',
        },
        '&:focus': {
          backgroundColor: '$orange-800',
        },
      },
    },
    {
      variant: 'solid',
      colorScheme: 'yellow',
      css: {
        borderColor: '$yellow-500',
        color: '$yellow-50',
        backgroundColor: '$yellow-600',
        '&:hover': {
          backgroundColor: '$yellow-700',
        },
        '&:focus': {
          backgroundColor: '$yellow-800',
        },
      },
    },
    {
      variant: 'solid',
      colorScheme: 'green',
      css: {
        borderColor: '$green-500',
        color: '$green-50',
        backgroundColor: '$green-600',
        '&:hover': {
          backgroundColor: '$green-700',
        },
        '&:focus': {
          backgroundColor: '$green-800',
        },
      },
    },
    {
      variant: 'solid',
      colorScheme: 'blue',
      css: {
        borderColor: '$blue-500',
        color: '$blue-50',
        backgroundColor: '$blue-600',
        '&:hover': {
          backgroundColor: '$blue-700',
        },
        '&:focus': {
          backgroundColor: '$blue-800',
        },
      },
    },
    {
      variant: 'solid',
      colorScheme: 'purple',
      css: {
        borderColor: '$purple-500',
        color: '$purple-50',
        backgroundColor: '$purple-600',
        '&:hover': {
          backgroundColor: '$purple-700',
        },
        '&:focus': {
          backgroundColor: '$purple-800',
        },
      },
    },
    {
      variant: 'outline',
      colorScheme: 'slate',
      css: {
        borderColor: '$slate-500',
        color: '$slate-900',
        backgroundColor: '$slate-50',
        '&:hover': {
          backgroundColor: '$slate-200',
        },
        '&:focus': {
          backgroundColor: '$slate-300',
        },
      },
    },
    {
      variant: 'outline',
      colorScheme: 'red',
      css: {
        borderColor: '$red-500',
        color: '$red-900',
        backgroundColor: '$red-50',
        '&:hover': {
          backgroundColor: '$red-200',
        },
        '&:focus': {
          backgroundColor: '$red-300',
        },
      },
    },
    {
      variant: 'outline',
      colorScheme: 'orange',
      css: {
        borderColor: '$orange-500',
        color: '$orange-900',
        backgroundColor: '$orange-50',
        '&:hover': {
          backgroundColor: '$orange-200',
        },
        '&:focus': {
          backgroundColor: '$orange-300',
        },
      },
    },
    {
      variant: 'outline',
      colorScheme: 'yellow',
      css: {
        borderColor: '$yellow-500',
        color: '$yellow-900',
        backgroundColor: '$yellow-50',
        '&:hover': {
          backgroundColor: '$yellow-200',
        },
        '&:focus': {
          backgroundColor: '$yellow-300',
        },
      },
    },
    {
      variant: 'outline',
      colorScheme: 'green',
      css: {
        borderColor: '$green-500',
        color: '$green-900',
        backgroundColor: '$green-50',
        '&:hover': {
          backgroundColor: '$green-200',
        },
        '&:focus': {
          backgroundColor: '$green-300',
        },
      },
    },
    {
      variant: 'outline',
      colorScheme: 'blue',
      css: {
        borderColor: '$blue-500',
        color: '$blue-900',
        backgroundColor: '$blue-50',
        '&:hover': {
          backgroundColor: '$blue-200',
        },
        '&:focus': {
          backgroundColor: '$blue-300',
        },
      },
    },
    {
      variant: 'outline',
      colorScheme: 'purple',
      css: {
        borderColor: '$purple-500',
        color: '$purple-900',
        backgroundColor: '$purple-50',
        '&:hover': {
          backgroundColor: '$purple-200',
        },
        '&:focus': {
          backgroundColor: '$purple-300',
        },
      },
    },
    {
      variant: 'ghost',
      colorScheme: 'slate',
      css: {
        color: '$slate-900',
        '&:hover': {
          borderColor: '$slate-500',
        },
        '&:focus': {
          borderColor: '$slate-500',
          backgroundColor: '$slate-200',
        },
      },
    },
    {
      variant: 'ghost',
      colorScheme: 'red',
      css: {
        color: '$red-900',
        '&:hover': {
          borderColor: '$red-500',
        },
        '&:focus': {
          borderColor: '$red-500',
          backgroundColor: '$red-200',
        },
      },
    },
    {
      variant: 'ghost',
      colorScheme: 'orange',
      css: {
        color: '$orange-900',
        '&:hover': {
          borderColor: '$orange-500',
        },
        '&:focus': {
          borderColor: '$orange-500',
          backgroundColor: '$orange-200',
        },
      },
    },
    {
      variant: 'ghost',
      colorScheme: 'yellow',
      css: {
        color: '$yellow-900',
        '&:hover': {
          borderColor: '$yellow-500',
        },
        '&:focus': {
          borderColor: '$yellow-500',
          backgroundColor: '$yellow-200',
        },
      },
    },
    {
      variant: 'ghost',
      colorScheme: 'green',
      css: {
        color: '$green-900',
        '&:hover': {
          borderColor: '$green-500',
        },
        '&:focus': {
          borderColor: '$green-500',
          backgroundColor: '$green-200',
        },
      },
    },
    {
      variant: 'ghost',
      colorScheme: 'blue',
      css: {
        color: '$blue-900',
        '&:hover': {
          borderColor: '$blue-500',
        },
        '&:focus': {
          borderColor: '$blue-500',
          backgroundColor: '$blue-200',
        },
      },
    },
    {
      variant: 'ghost',
      colorScheme: 'purple',
      css: {
        color: '$purple-900',
        '&:hover': {
          borderColor: '$purple-500',
        },
        '&:focus': {
          borderColor: '$purple-500',
          backgroundColor: '$purple-200',
        },
      },
    },
  ],
  defaultVariants: {
    variant: 'outline',
    colorScheme: 'slate',
    size: 'sm',
    borderRadius: 'normal',
  },
});
