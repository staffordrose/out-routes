import {
  ComponentPropsWithoutRef,
  ElementType,
  ForwardedRef,
  forwardRef,
} from 'react';
import type * as Stitches from '@stitches/react';

import { styled } from '@/styles';

export type CenterProps = ComponentPropsWithoutRef<typeof StyledCenter> & {
  as?: ElementType;
  css?: Stitches.CSS;
  direction?: 'row' | 'column';
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  width?: 'auto' | 'full';
  height?: 'auto' | 'full';
  marginBottom?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
};

export const Center = forwardRef(
  (props: CenterProps, ref: ForwardedRef<HTMLDivElement>) => {
    return <StyledCenter {...props} ref={ref} />;
  }
);

Center.displayName = 'Center';

const StyledCenter = styled('div', {
  all: 'unset',
  boxSizing: 'border-box',
  display: 'flex',
  placeItems: 'center',
  variants: {
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
});
