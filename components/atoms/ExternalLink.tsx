import {
  ComponentPropsWithoutRef,
  ElementType,
  ForwardedRef,
  forwardRef,
} from 'react';
import type * as Stitches from '@stitches/react';

import { styled } from '@/styles';

export type ExternalLinkProps = ComponentPropsWithoutRef<
  typeof StyledExternalLink
> & {
  as?: ElementType;
  css?: Stitches.CSS;
  variant?: 'dashed' | 'solid';
  fontFamily?: 'heading' | 'body';
  fontSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
};

export const ExternalLink = forwardRef(
  (props: ExternalLinkProps, ref: ForwardedRef<HTMLAnchorElement>) => {
    return (
      <StyledExternalLink
        {...props}
        ref={ref}
        target="_blank"
        rel="noreferrer"
      />
    );
  }
);

ExternalLink.displayName = 'ExternalLink';

const StyledExternalLink = styled('a', {
  all: 'unset',
  boxSizing: 'border-box',
  fontWeight: '$medium',
  textDecoration: 'underline',
  textDecorationThickness: '2px',
  textDecorationStyle: 'dashed',
  textDecorationColor: 'transparent',
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
