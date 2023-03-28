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
  fontStyle?: 'italic';
  fontWeight?: 'light' | 'medium' | 'bold';
  lineHeight?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
} & (
    | {
        colorScheme:
          | 'slate'
          | 'red'
          | 'orange'
          | 'yellow'
          | 'green'
          | 'blue'
          | 'purple';
        colorScale: 500 | 700 | 900;
      }
    | {
        colorScheme?: never;
        colorScale?: never;
      }
  );

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
    fontStyle: {
      italic: { fontStyle: 'italic' },
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
      'slate-500': { color: '$slate-500' },
      'slate-700': { color: '$slate-700' },
      'slate-900': { color: '$slate-900' },
      'green-700': { color: '$green-700' },
      'green-900': { color: '$green-900' },
      'red-700': { color: '$red-700' },
      'red-900': { color: '$red-900' },
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
    colorScale: {
      500: {},
      700: {},
      900: {},
    },
  },
  compoundVariants: [
    {
      colorScheme: 'slate',
      colorScale: 500,
      css: {
        color: '$slate-500',
      },
    },
    {
      colorScheme: 'slate',
      colorScale: 700,
      css: {
        color: '$slate-700',
      },
    },
    {
      colorScheme: 'slate',
      colorScale: 900,
      css: {
        color: '$slate-900',
      },
    },
    {
      colorScheme: 'red',
      colorScale: 500,
      css: {
        color: '$red-500',
      },
    },
    {
      colorScheme: 'red',
      colorScale: 700,
      css: {
        color: '$red-700',
      },
    },
    {
      colorScheme: 'red',
      colorScale: 900,
      css: {
        color: '$red-900',
      },
    },
    {
      colorScheme: 'orange',
      colorScale: 500,
      css: {
        color: '$orange-500',
      },
    },
    {
      colorScheme: 'orange',
      colorScale: 700,
      css: {
        color: '$orange-700',
      },
    },
    {
      colorScheme: 'orange',
      colorScale: 900,
      css: {
        color: '$orange-900',
      },
    },
    {
      colorScheme: 'yellow',
      colorScale: 500,
      css: {
        color: '$yellow-500',
      },
    },
    {
      colorScheme: 'yellow',
      colorScale: 700,
      css: {
        color: '$yellow-700',
      },
    },
    {
      colorScheme: 'yellow',
      colorScale: 900,
      css: {
        color: '$yellow-900',
      },
    },
    {
      colorScheme: 'green',
      colorScale: 500,
      css: {
        color: '$green-500',
      },
    },
    {
      colorScheme: 'green',
      colorScale: 700,
      css: {
        color: '$green-700',
      },
    },
    {
      colorScheme: 'green',
      colorScale: 900,
      css: {
        color: '$green-900',
      },
    },
    {
      colorScheme: 'blue',
      colorScale: 500,
      css: {
        color: '$blue-500',
      },
    },
    {
      colorScheme: 'blue',
      colorScale: 700,
      css: {
        color: '$blue-700',
      },
    },
    {
      colorScheme: 'blue',
      colorScale: 900,
      css: {
        color: '$blue-900',
      },
    },
    {
      colorScheme: 'purple',
      colorScale: 500,
      css: {
        color: '$purple-500',
      },
    },
    {
      colorScheme: 'purple',
      colorScale: 700,
      css: {
        color: '$purple-700',
      },
    },
    {
      colorScheme: 'purple',
      colorScale: 900,
      css: {
        color: '$purple-900',
      },
    },
  ],
});
