import {
  ComponentPropsWithoutRef,
  ElementType,
  ForwardedRef,
  forwardRef,
} from 'react';
import type * as Stitches from '@stitches/react';

import { styled } from '@/styles';

export type BoxProps = ComponentPropsWithoutRef<typeof StyledBox> & {
  as?: ElementType;
  css?: Stitches.CSS;
  display?: 'inline' | 'inline-block' | 'block';
  width?: 'auto' | 'full';
  height?: 'auto' | 'full';
  marginBottom?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
};

export const Box = forwardRef(
  (props: BoxProps, ref: ForwardedRef<HTMLDivElement>) => {
    return <StyledBox {...props} ref={ref} />;
  }
);

Box.displayName = 'Box';

const StyledBox = styled('div', {
  all: 'unset',
  boxSizing: 'border-box',
  variants: {
    display: {
      block: { display: 'block' },
      'inline-block': { display: 'inline-block' },
      inline: { display: 'inline' },
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
    display: 'block',
  },
});
