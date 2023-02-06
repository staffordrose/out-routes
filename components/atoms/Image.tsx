import {
  ComponentPropsWithoutRef,
  ElementType,
  ForwardedRef,
  forwardRef,
} from 'react';
import NextImage from 'next/image';
import type * as Stitches from '@stitches/react';

import { styled } from '@/styles';

export type ImageProps = ComponentPropsWithoutRef<typeof StyledImage> & {
  as?: ElementType;
  css?: Stitches.CSS;
  fill?: boolean;
  priority?: boolean;
  src: string;
  alt: string;
  width?: number;
  height?: number;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  objectPosition?:
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'middle-left'
    | 'middle-center'
    | 'middle-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right';
};

export const Image = forwardRef(
  (props: ImageProps, ref: ForwardedRef<HTMLSpanElement>) => {
    return <StyledImage {...props} ref={ref} />;
  }
);

Image.displayName = 'Image';

const StyledImage = styled(NextImage, {
  overflow: 'hidden',
  display: 'block',
  variants: {
    objectFit: {
      contain: { objectFit: 'contain' },
      cover: { objectFit: 'cover' },
      fill: { objectFit: 'fill' },
      none: { objectFit: 'none' },
      'scale-down': { objectFit: 'scale-down' },
    },
    objectPosition: {
      'top-left': { objectPosition: '25% 75%' },
      'top-center': { objectPosition: '50% 75%' },
      'top-right': { objectPosition: '75% 75%' },
      'middle-left': { objectPosition: '25% 50%' },
      'middle-center': { objectPosition: '50% 50%' },
      'middle-right': { objectPosition: '75% 50%' },
      'bottom-left': { objectPosition: '25% 25%' },
      'bottom-center': { objectPosition: '50% 25%' },
      'bottom-right': { objectPosition: '75% 25%' },
    },
  },
});
