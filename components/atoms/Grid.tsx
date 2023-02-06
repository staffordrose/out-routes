import {
  ComponentPropsWithoutRef,
  ElementType,
  ForwardedRef,
  forwardRef,
} from 'react';
import type * as Stitches from '@stitches/react';

import { styled } from '@/styles';

export type GridProps = ComponentPropsWithoutRef<typeof StyledGrid> & {
  as?: ElementType;
  css?: Stitches.CSS;
  display?: 'inline-grid' | 'grid';
  columns?: 2 | 3 | 4 | 5 | 6;
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  justifyContent?:
    | 'center'
    | 'start'
    | 'end'
    | 'left'
    | 'right'
    | 'normal'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
    | 'stretch';
  justifyItems?:
    | 'center'
    | 'start'
    | 'end'
    | 'left'
    | 'right'
    | 'normal'
    | 'baseline'
    | 'stretch';
  alignContent?:
    | 'center'
    | 'start'
    | 'end'
    | 'left'
    | 'right'
    | 'normal'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
    | 'stretch';
  alignItems?:
    | 'center'
    | 'start'
    | 'end'
    | 'left'
    | 'right'
    | 'normal'
    | 'baseline'
    | 'stretch';
  placeItems?: 'center';
  width?: 'auto' | 'full';
  height?: 'auto' | 'full';
  marginBottom?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
};

export const Grid = forwardRef(
  (props: GridProps, ref: ForwardedRef<HTMLDivElement>) => {
    return <StyledGrid {...props} ref={ref} />;
  }
);

Grid.displayName = 'Grid';

const StyledGrid = styled('div', {
  all: 'unset',
  boxSizing: 'border-box',
  variants: {
    display: {
      'inline-grid': { display: 'inline-grid' },
      grid: { display: 'grid' },
    },
    columns: {
      2: {
        gridTemplateColumns:
          'repeat(auto-fill, minmax(calc(($container_xl / 2) - $2), 1fr))',
      },
      3: {
        gridTemplateColumns:
          'repeat(auto-fill, minmax(calc(($container_xl / 3) - $4), 1fr))',
      },
      4: {
        gridTemplateColumns:
          'repeat(auto-fill, minmax(calc(($container_xl / 4) - $6), 1fr))',
      },
      5: {
        gridTemplateColumns:
          'repeat(auto-fill, minmax(calc(($container_xl / 5) - $8), 1fr))',
      },
      6: {
        gridTemplateColumns:
          'repeat(auto-fill, minmax(calc(($container_xl / 6) - $10), 1fr))',
      },
    },
    gap: {
      xs: { gap: '$1' },
      sm: { gap: '$2' },
      md: { gap: '$3' },
      lg: { gap: '$4' },
      xl: { gap: '$6' },
      '2xl': { gap: '$8' },
    },
    justifyContent: {
      center: { justifyContent: 'center' },
      start: { justifyContent: 'start' },
      end: { justifyContent: 'end' },
      'flex-start': { justifyContent: 'flex-start' },
      'flex-end': { justifyContent: 'flex-end' },
      left: { justifyContent: 'left' },
      right: { justifyContent: 'right' },
      normal: { justifyContent: 'normal' },
      'space-between': { justifyContent: 'space-between' },
      'space-around': { justifyContent: 'space-around' },
      'space-evenly': { justifyContent: 'space-evenly' },
      stretch: { justifyContent: 'stretch' },
    },
    alignItems: {
      center: { alignItems: 'center' },
      start: { alignItems: 'start' },
      end: { alignItems: 'end' },
      'flex-start': { alignItems: 'flex-start' },
      'flex-end': { alignItems: 'flex-end' },
      left: { alignItems: 'left' },
      right: { alignItems: 'right' },
      normal: { alignItems: 'normal' },
      baseline: { alignItems: 'baseline' },
      stretch: { alignItems: 'stretch' },
    },
    placeItems: {
      center: { placeItems: 'center' },
    },
    width: {
      auto: { width: '$auto' },
      full: { width: '$full' },
    },
    height: {
      auto: { height: '$auto' },
      full: { height: '$full' },
    },
    marginBottom: {
      xs: { marginBottom: '$1' },
      sm: { marginBottom: '$2' },
      md: { marginBottom: '$3' },
      lg: { marginBottom: '$4' },
      xl: { marginBottom: '$6' },
      '2xl': { marginBottom: '$8' },
    },
  },
  defaultVariants: {
    display: 'grid',
  },
});
