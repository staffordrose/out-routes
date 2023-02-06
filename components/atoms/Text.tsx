import {
  ComponentPropsWithoutRef,
  ElementType,
  ForwardedRef,
  forwardRef,
} from 'react';
import type * as Stitches from '@stitches/react';

import { styled } from '@/styles';

export type TextProps = ComponentPropsWithoutRef<typeof StyledText> & {
  as?: ElementType;
  css?: Stitches.CSS;
  fontFamily?: 'heading' | 'body';
  fontSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  fontWeight?: 'light' | 'medium' | 'bold';
  lineHeight?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  color?:
    | 'slate-700'
    | 'slate-900'
    | 'green-700'
    | 'green-900'
    | 'red-700'
    | 'red-900';
};

export const Text = forwardRef(
  (props: TextProps, ref: ForwardedRef<HTMLParagraphElement>) => {
    return <StyledText {...props} ref={ref} />;
  }
);

Text.displayName = 'Text';

const StyledText = styled('p', {
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
    color: {
      'slate-700': { color: '$slate-700' },
      'slate-900': { color: '$slate-900' },
      'green-700': { color: '$green-700' },
      'green-900': { color: '$green-900' },
      'red-700': { color: '$red-700' },
      'red-900': { color: '$red-900' },
    },
  },
});
