import { ComponentPropsWithoutRef, ForwardedRef, forwardRef } from 'react';
import type * as Stitches from '@stitches/react';

import { styled } from '@/styles';

export type HeadingProps = ComponentPropsWithoutRef<typeof StyledHeading> & {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  css?: Stitches.CSS;
  lineHeight?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
};

export const Heading = forwardRef(
  (props: HeadingProps, ref: ForwardedRef<HTMLHeadingElement>) => {
    return <StyledHeading {...props} ref={ref} />;
  }
);

Heading.displayName = 'Heading';

const StyledHeading = styled('h6', {
  color: '$slate-900',
  variants: {
    lineHeight: {
      xs: { lineHeight: '$xs' },
      sm: { lineHeight: '$sm' },
      md: { lineHeight: '$md' },
      lg: { lineHeight: '$lg' },
      xl: { lineHeight: '$xl' },
      '2xl': { lineHeight: '$2xl' },
      '3xl': { lineHeight: '$3xl' },
      '4xl': { lineHeight: '$4xl' },
    },
  },
});
