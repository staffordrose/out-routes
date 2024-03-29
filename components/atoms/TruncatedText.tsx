import {
  ComponentPropsWithoutRef,
  ElementType,
  ForwardedRef,
  forwardRef,
} from 'react';
import type * as Stitches from '@stitches/react';

import { styled } from '@/styles';

export type TruncatedTextProps = ComponentPropsWithoutRef<
  typeof StyledTruncatedText
> & {
  as?: ElementType;
  css?: Stitches.CSS;
  fontFamily?: 'heading' | 'body';
  fontSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  fontWeight?: 'light' | 'medium' | 'bold';
  lineHeight?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  lineClamp?: 1 | 2 | 3 | 4 | 6 | 8;
};

export const TruncatedText = forwardRef(
  (props: TruncatedTextProps, ref: ForwardedRef<HTMLParagraphElement>) => {
    return <StyledTruncatedText {...props} ref={ref} />;
  }
);

TruncatedText.displayName = 'TruncatedText';

const StyledTruncatedText = styled('p', {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  boxOrient: 'vertical',
  variants: {
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
      '2xl': { fontSize: '$2xl' },
    },
    fontWeight: {
      light: { fontWeight: '$light' },
      medium: { fontWeight: '$medium' },
      bold: { fontWeight: '$bold' },
    },
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
    lineClamp: {
      1: {
        WebkitLineClamp: 1,
        lineClamp: 1,
      },
      2: {
        WebkitLineClamp: 2,
        lineClamp: 2,
      },
      3: {
        WebkitLineClamp: 3,
        lineClamp: 3,
      },
      4: {
        WebkitLineClamp: 4,
        lineClamp: 4,
      },
      6: {
        WebkitLineClamp: 6,
        lineClamp: 6,
      },
      8: {
        WebkitLineClamp: 8,
        lineClamp: 8,
      },
    },
  },
  defaultVariants: {
    lineClamp: 1,
  },
});
