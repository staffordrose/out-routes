import {
  ComponentPropsWithoutRef,
  ElementType,
  ForwardedRef,
  forwardRef,
} from 'react';
import * as RadixSwitch from '@radix-ui/react-switch';
import type * as Stitches from '@stitches/react';

import { styled } from '@/styles';

export type SwitchProps = ComponentPropsWithoutRef<typeof StyledSwitch> & {
  as?: ElementType;
  css?: Stitches.CSS;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isError?: boolean;
};

export const Switch = forwardRef(
  (props: SwitchProps, ref: ForwardedRef<HTMLDivElement>) => {
    return (
      <StyledSwitch {...props} ref={ref}>
        <SwitchThumb />
      </StyledSwitch>
    );
  }
);

Switch.displayName = 'Switch';

const thumbSize = 24;
const thumbPd = 2;

const StyledSwitch = styled(RadixSwitch.Root, {
  all: 'unset',
  position: 'relative',
  width: thumbSize * 2,
  height: thumbSize + thumbPd * 2,
  borderWidth: '$1',
  borderStyle: 'solid',
  borderColor: '$slate-300',
  borderRadius: '$full',
  backgroundColor: 'transparent',
  WebkitTapHighlightColor: '$black',
  cursor: 'pointer',
  '&:hover:enabled': {
    borderColor: '$slate-700',
    backgroundColor: '$slate-50',
  },
  '&:focus:enabled': {
    borderColor: '$slate-700',
    outlineWidth: '$1',
    outlineStyle: 'solid',
    outlineColor: '$blue-300',
    backgroundColor: '$slate-50',
  },
  '&[data-state="checked"]': {
    borderColor: '$slate-400',
    backgroundColor: '$slate-300',
    '&:hover:enabled': {
      backgroundColor: '$slate-300',
    },
    '&:focus:enabled': {
      backgroundColor: '$slate-300',
    },
  },
  variants: {
    isError: {
      true: {
        borderColor: '$red-700',
        backgroundColor: '$red-50',
        '&:hover:enabled': {
          borderColor: '$red-700',
          backgroundColor: '$white',
        },
        '&:focus:enabled': {
          borderColor: '$red-700',
          outlineWidth: '$1',
          outlineStyle: 'solid',
          outlineColor: '$red-300',
          backgroundColor: '$white',
        },
        '&[data-state="checked"]': {
          borderColor: '$red-700',
          backgroundColor: '$red-50',
          '&:hover:enabled': {
            borderColor: '$red-700',
            backgroundColor: '$white',
          },
          '&:focus:enabled': {
            borderColor: '$red-700',
            outlineWidth: '$1',
            outlineStyle: 'solid',
            outlineColor: '$red-300',
            backgroundColor: '$white',
          },
        },
      },
    },
  },
});

const SwitchThumb = styled(RadixSwitch.Thumb, {
  display: 'block',
  width: thumbSize,
  height: thumbSize,
  borderRadius: '$full',
  backgroundColor: '$slate-700',
  transform: `translateX(${thumbPd}px)`,
  transition: 'transform 100ms',
  willChange: 'transform',
  '&[data-state="checked"]': {
    transform: `translateX(${thumbSize - thumbPd}px)`,
  },
});
