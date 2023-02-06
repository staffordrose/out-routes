import {
  ComponentPropsWithoutRef,
  ElementType,
  ForwardedRef,
  forwardRef,
} from 'react';
import * as RadixSeparator from '@radix-ui/react-separator';
import type * as Stitches from '@stitches/react';

import { styled } from '@/styles';

export type SeparatorProps = ComponentPropsWithoutRef<typeof SeparatorRoot> & {
  as?: ElementType;
  css?: Stitches.CSS;
  width?:
    | 'xs'
    | 'sm'
    | 'md'
    | 'lg'
    | 'xl'
    | '2xl'
    | '1-8'
    | '1-4'
    | '1-2'
    | '3-4'
    | 'full';
  height?:
    | 'xs'
    | 'sm'
    | 'md'
    | 'lg'
    | 'xl'
    | '2xl'
    | '1-8'
    | '1-4'
    | '1-2'
    | '3-4'
    | 'full';
  marginX?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  marginY?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  colorScale?: 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
};

export const Separator = forwardRef(
  (props: SeparatorProps, ref: ForwardedRef<HTMLDivElement>) => {
    return <SeparatorRoot {...props} ref={ref} />;
  }
);

Separator.displayName = 'Separator';

const SeparatorRoot = styled(RadixSeparator.Root, {
  variants: {
    width: {
      xs: { width: '$px' },
      sm: { width: '2px' },
      md: { width: '3px' },
      lg: { width: '4px' },
      xl: { width: '6px' },
      '2xl': { width: '8px' },
      '1-8': { width: '12.5%' },
      '1-4': { width: '25%' },
      '1-2': { width: '50%' },
      '3-4': { width: '75%' },
      full: { width: '$full' },
    },
    height: {
      xs: { height: '$px' },
      sm: { height: '2px' },
      md: { height: '3px' },
      lg: { height: '4px' },
      xl: { height: '6px' },
      '2xl': { height: '8px' },
      '1-8': { height: '12.5%' },
      '1-4': { height: '25%' },
      '1-2': { height: '50%' },
      '3-4': { height: '75%' },
      full: { height: '$full' },
    },
    marginX: {
      xs: { marginX: '$1' },
      sm: { marginX: '$2' },
      md: { marginX: '$3' },
      lg: { marginX: '$4' },
      xl: { marginX: '$6' },
      '2xl': { marginX: '$8' },
    },
    marginY: {
      xs: { marginY: '$1' },
      sm: { marginY: '$2' },
      md: { marginY: '$3' },
      lg: { marginY: '$4' },
      xl: { marginY: '$6' },
      '2xl': { marginY: '$8' },
    },
    colorScale: {
      50: { backgroundColor: '$slate-50' },
      100: { backgroundColor: '$slate-100' },
      200: { backgroundColor: '$slate-200' },
      300: { backgroundColor: '$slate-300' },
      400: { backgroundColor: '$slate-400' },
      500: { backgroundColor: '$slate-500' },
      600: { backgroundColor: '$slate-600' },
      700: { backgroundColor: '$slate-700' },
      800: { backgroundColor: '$slate-800' },
      900: { backgroundColor: '$slate-900' },
    },
  },
  defaultVariants: {
    colorScale: 300,
  },
});
