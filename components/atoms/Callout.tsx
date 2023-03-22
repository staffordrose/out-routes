import {
  ComponentPropsWithoutRef,
  ElementType,
  ForwardedRef,
  forwardRef,
} from 'react';
import type * as Stitches from '@stitches/react';

import { styled } from '@/styles';

export type CalloutProps = ComponentPropsWithoutRef<typeof StyledCallout> & {
  as?: ElementType;
  css?: Stitches.CSS;
  colorScheme?:
    | 'slate'
    | 'red'
    | 'orange'
    | 'yellow'
    | 'green'
    | 'blue'
    | 'purple';
};

export const Callout = forwardRef(
  (props: CalloutProps, ref: ForwardedRef<HTMLDivElement>) => {
    return <StyledCallout {...props} ref={ref} gap='xs' />;
  }
);

Callout.displayName = 'Callout';

const StyledCallout = styled('div', {
  display: 'inline-flex',
  gap: '$3',
  justifyContent: 'flex-start',
  padding: '$3',
  borderRadius: '$md',
  fontSize: '$sm',
  '& > svg': {
    flexShrink: 0,
    width: '$6',
    height: '$6',
  },
  variants: {
    colorScheme: {
      slate: {
        color: '$slate-900',
        backgroundColor: '$slate-100',
      },
      red: {
        color: '$red-900',
        backgroundColor: '$red-100',
      },
      orange: {
        color: '$orange-900',
        backgroundColor: '$orange-100',
      },
      yellow: {
        color: '$yellow-900',
        backgroundColor: '$yellow-100',
      },
      green: {
        color: '$green-900',
        backgroundColor: '$green-100',
      },
      blue: {
        color: '$blue-900',
        backgroundColor: '$blue-100',
      },
      purple: {
        color: '$purple-900',
        backgroundColor: '$purple-100',
      },
    },
  },
  defaultVariants: {
    colorScheme: 'slate',
  },
});
