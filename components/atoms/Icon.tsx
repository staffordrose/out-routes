import { ComponentPropsWithoutRef, ForwardedRef, forwardRef } from 'react';
import { IconType } from 'react-icons';
import type * as Stitches from '@stitches/react';

import { styled } from '@/styles';

export type IconProps = ComponentPropsWithoutRef<typeof StyledIcon> & {
  as: IconType;
  css?: Stitches.CSS;
  size?:
    | 'xs'
    | 'sm'
    | 'md'
    | 'lg'
    | 'xl'
    | '2xl'
    | '3xl'
    | '4xl'
    | '5xl'
    | '6xl';
};

export const Icon = forwardRef(
  (
    { as: IconComp, ...restProps }: IconProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    return (
      <StyledIcon {...restProps} ref={ref}>
        <IconComp />
      </StyledIcon>
    );
  }
);

Icon.displayName = 'Icon';

const StyledIcon = styled('div', {
  all: 'unset',
  boxSizing: 'border-box',
  display: 'flex',
  placeItems: 'center',
  userSelect: 'none',
  variants: {
    size: {
      xs: {
        '& > svg': {
          width: '$4_5',
          height: '$4_5',
        },
      },
      sm: {
        '& > svg': {
          width: '$6',
          height: '$6',
        },
      },
      md: {
        '& > svg': {
          width: '$8',
          height: '$8',
        },
      },
      lg: {
        '& > svg': {
          width: '$9_5',
          height: '$9_5',
        },
      },
      xl: {
        '& > svg': {
          width: '$11',
          height: '$11',
        },
      },
      '2xl': {
        '& > svg': {
          width: '$13',
          height: '$13',
        },
      },
      '3xl': {
        '& > svg': {
          width: '$15',
          height: '$15',
        },
      },
      '4xl': {
        '& > svg': {
          width: '$17',
          height: '$17',
        },
      },
      '5xl': {
        '& > svg': {
          width: '$20',
          height: '$20',
        },
      },
      '6xl': {
        '& > svg': {
          width: '$24',
          height: '$24',
        },
      },
    },
  },
  defaultVariants: {
    size: 'sm',
  },
});
