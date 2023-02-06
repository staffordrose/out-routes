import { ComponentPropsWithoutRef, ForwardedRef, forwardRef } from 'react';
import NextLink from 'next/link';
import type * as Stitches from '@stitches/react';

import { styled } from '@/styles';

export type LinkProps = ComponentPropsWithoutRef<typeof StyledLink> & {
  css?: Stitches.CSS;
  variant?: 'dashed' | 'solid';
  fontFamily?: 'heading' | 'body';
  fontSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
};

export const Link = forwardRef(
  (props: LinkProps, ref: ForwardedRef<HTMLAnchorElement>) => {
    return <StyledLink {...props} ref={ref} />;
  }
);

Link.displayName = 'Link';

const StyledLink = styled(NextLink, {
  all: 'unset',
  boxSizing: 'border-box',
  fontWeight: '$medium',
  textDecoration: 'underline',
  textDecorationThickness: '2px',
  textDecorationStyle: 'dashed',
  textDecorationColor: 'transparent',
  textDecorationSkipInk: 'none',
  textUnderlineOffset: '0.25em',
  color: '$slate-700',
  cursor: 'pointer',
  variants: {
    variant: {
      dashed: {
        '&:hover': {
          textDecorationColor: '$slate-500',
        },
        '&:focus': {
          textDecorationColor: '$slate-500',
        },
      },
      solid: {
        textDecorationColor: '$slate-500',
        '&:hover': {
          textDecorationStyle: 'solid',
        },
        '&:focus': {
          textDecorationStyle: 'solid',
        },
      },
    },
    fontFamily: {
      heading: { fontFamily: '$heading' },
      body: { fontFamily: '$body' },
    },
    fontSize: {
      inherit: { fontSize: 'inherit' },
      xs: { fontSize: '$xs' },
      sm: { fontSize: '$sm' },
      md: { fontSize: '$md' },
      lg: { fontSize: '$lg' },
      xl: { fontSize: '$xl' },
    },
  },
  defaultVariants: {
    variant: 'dashed',
  },
});
