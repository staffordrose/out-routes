import { ComponentPropsWithoutRef, ForwardedRef, forwardRef } from 'react';
import NextLink from 'next/link';
import type * as Stitches from '@stitches/react';

import { styled } from '@/styles';

export type LinkProps = ComponentPropsWithoutRef<typeof StyledLink> & {
  css?: Stitches.CSS;
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
  textDecorationThickness: '1px',
  textDecorationStyle: 'solid',
  textDecorationColor: '$slate-300',
  textUnderlineOffset: '0.25em',
  color: '$slate-700',
  cursor: 'pointer',
  '&:hover': {
    textDecorationColor: '$slate-500',
  },
  '&:focus': {
    textDecorationColor: '$slate-500',
  },
  variants: {
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
});
