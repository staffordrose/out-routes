import { ComponentPropsWithoutRef, ForwardedRef, forwardRef } from 'react';
import type * as Stitches from '@stitches/react';

import { styled } from '@/styles';

export type ListProps = ComponentPropsWithoutRef<typeof StyledList> & {
  as: 'ul' | 'ol';
  css?: Stitches.CSS;
  display?: 'inline-flex' | 'flex';
  direction?: 'row' | 'column';
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  justifyContent?:
    | 'center'
    | 'start'
    | 'end'
    | 'flex-start'
    | 'flex-end'
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
    | 'flex-start'
    | 'flex-end'
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

export const List = forwardRef(
  (props: ListProps, ref: ForwardedRef<HTMLDivElement>) => {
    return <StyledList {...props} ref={ref} />;
  }
);

List.displayName = 'List';

const StyledList = styled('div', {
  all: 'unset',
  boxSizing: 'border-box',
  listStyle: 'none',
  variants: {
    display: {
      flex: { display: 'flex' },
      'inline-flex': { display: 'inline-flex' },
    },
    direction: {
      row: { flexDirection: 'row' },
      column: { flexDirection: 'column' },
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
    display: 'flex',
  },
});
