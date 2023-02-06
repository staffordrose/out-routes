import {
  ComponentPropsWithoutRef,
  ElementType,
  ForwardedRef,
  forwardRef,
} from 'react';
import type * as Stitches from '@stitches/react';

import { styled } from '@/styles';

export type KBDProps = ComponentPropsWithoutRef<typeof StyledKBD> & {
  as?: ElementType;
  css?: Stitches.CSS;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
};

export const KBD = forwardRef(
  (props: KBDProps, ref: ForwardedRef<HTMLSpanElement>) => {
    return <StyledKBD {...props} ref={ref} />;
  }
);

KBD.displayName = 'KBD';

const StyledKBD = styled('kbd', {
  all: 'unset',
  boxSizing: 'border-box',
  padding: '$1 $2',
  borderBottomWidth: '$2',
  borderBottomStyle: 'solid',
  borderBottomColor: '$slate-300',
  borderRadius: '$md',
  fontWeight: '$medium',
  color: '$slate-700',
  backgroundColor: '$slate-200',
  variants: {
    size: {
      xs: {
        fontSize: '$xs',
      },
      sm: {
        fontSize: '$sm',
      },
      md: {
        fontSize: '$md',
      },
      lg: {
        fontSize: '$lg',
      },
      xl: {
        fontSize: '$xl',
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});
