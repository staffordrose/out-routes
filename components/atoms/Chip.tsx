import {
  ComponentPropsWithoutRef,
  ElementType,
  ForwardedRef,
  forwardRef,
} from 'react';
import type * as Stitches from '@stitches/react';

import { styled } from '@/styles';

export type ChipProps = ComponentPropsWithoutRef<typeof StyledChip> & {
  as?: ElementType;
  css?: Stitches.CSS;
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
};

export const Chip = forwardRef(
  (props: ChipProps, ref: ForwardedRef<HTMLDivElement>) => {
    return <StyledChip {...props} ref={ref} gap='xs' />;
  }
);

Chip.displayName = 'Chip';

const StyledChip = styled('div', {
  display: 'inline-flex',
  placeItems: 'center',
  paddingX: '$1',
  borderRadius: '$md',
  fontSize: '$sm',
  backgroundColor: '$slate-300',
  variants: {
    gap: {
      xs: { gap: '$1' },
      sm: { gap: '$2' },
      md: { gap: '$3' },
      lg: { gap: '$4' },
      xl: { gap: '$6' },
      '2xl': { gap: '$8' },
    },
  },
});
