import {
  ComponentPropsWithoutRef,
  ElementType,
  ForwardedRef,
  forwardRef,
} from 'react';
import * as RadixAspectRatio from '@radix-ui/react-aspect-ratio';
import * as Stitches from '@stitches/react';

import { styled } from '@/styles';

export type AspectRatioProps = ComponentPropsWithoutRef<
  typeof StyledAspectRatio
> & {
  as?: ElementType;
  css?: Stitches.CSS;
  ratio: number;
};

export const AspectRatio = forwardRef(
  (props: AspectRatioProps, ref: ForwardedRef<HTMLDivElement>) => {
    return <StyledAspectRatio {...props} ref={ref} />;
  }
);

AspectRatio.displayName = 'AspectRatio';

const StyledAspectRatio = styled(RadixAspectRatio.Root, {
  position: 'relatvie', // Required by Image component
  overflow: 'hidden',
  display: 'flex',
  placeItems: 'center',
});
