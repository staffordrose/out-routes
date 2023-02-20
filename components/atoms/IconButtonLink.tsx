import { ComponentPropsWithoutRef, ForwardedRef, forwardRef } from 'react';
import NextLink from 'next/link';
import type * as Stitches from '@stitches/react';

import { styled } from '@/styles';

export type IconButtonLinkProps = ComponentPropsWithoutRef<
  typeof StyledIconButtonLink
> & {
  css?: Stitches.CSS;
  variant?: 'solid' | 'outline' | 'ghost';
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
        borderColor: '$slate-500',
        color: '$slate-50',
        backgroundColor: '$slate-600',
        '&:hover': {
          borderStyle: 'dashed',
          backgroundColor: '$slate-700',
        },
        '&:focus': {
          borderStyle: 'dashed',
          backgroundColor: '$slate-800',
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
      },
      ghost: {
        borderColor: 'transparent',
        color: '$slate-900',
        backgroundColor: 'transparent',
        '&:hover': {
          borderStyle: 'dashed',
          borderColor: '$slate-500',
        },
        '&:focus': {
          borderStyle: 'dashed',
          borderColor: '$slate-500',
          backgroundColor: '$slate-200',
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
    borderRadius: {
      normal: { borderRadius: '$md' },
      full: { borderRadius: '$full' },
    },
  },
  defaultVariants: {
    variant: 'outline',
    size: 'sm',
    borderRadius: 'normal',
  },
});
