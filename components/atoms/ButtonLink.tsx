import { ComponentPropsWithoutRef, ForwardedRef, forwardRef } from 'react';
import NextLink from 'next/link';
import type * as Stitches from '@stitches/react';

import { styled } from '@/styles';

export type ButtonLinkProps = ComponentPropsWithoutRef<
  typeof StyledButtonLink
> & {
  css?: Stitches.CSS;
  variant?: 'solid' | 'outline' | 'ghost';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
};

export const ButtonLink = forwardRef(
  (props: ButtonLinkProps, ref: ForwardedRef<HTMLAnchorElement>) => {
    return <StyledButtonLink {...props} ref={ref} />;
  }
);

ButtonLink.displayName = 'ButtonLink';

const StyledButtonLink = styled(NextLink, {
  all: 'unset',
  boxSizing: 'border-box',
  display: 'flex',
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
  },
  defaultVariants: {
    variant: 'outline',
    size: 'sm',
  },
});
