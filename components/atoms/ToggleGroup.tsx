import {
  ComponentPropsWithoutRef,
  ElementType,
  ForwardedRef,
  forwardRef,
  ForwardRefExoticComponent,
  RefAttributes,
} from 'react';
import * as RadixToggleGroup from '@radix-ui/react-toggle-group';
import type * as Stitches from '@stitches/react';

import { styled } from '@/styles';

export type ToggleGroupProps = ComponentPropsWithoutRef<
  typeof StyledToggleGroup
>;

type ToggleGroupComponent = ForwardRefExoticComponent<
  ToggleGroupProps & RefAttributes<HTMLDivElement>
> & {
  Item: ForwardRefExoticComponent<ItemProps & RefAttributes<HTMLButtonElement>>;
};

export const ToggleGroup = forwardRef(
  (props: ToggleGroupProps, ref: ForwardedRef<HTMLDivElement>) => {
    return <StyledToggleGroup ref={ref} {...props} />;
  }
) as ToggleGroupComponent;

ToggleGroup.displayName = 'ToggleGroup';

const StyledToggleGroup = styled(RadixToggleGroup.Root, {
  display: 'inline-flex',
  borderRadius: '$md',
  backgroundColor: '$white',
});

// Item
type ItemProps = ComponentPropsWithoutRef<typeof StyledItem> & {
  as?: ElementType;
  css?: Stitches.CSS;
  variant?: 'solid' | 'outline' | 'ghost';
  colorScheme?:
    | 'slate'
    | 'red'
    | 'orange'
    | 'yellow'
    | 'green'
    | 'blue'
    | 'purple';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
};

const Item = forwardRef(
  (props: ItemProps, ref: ForwardedRef<HTMLButtonElement>) => {
    return <StyledItem ref={ref} {...props} />;
  }
);

Item.displayName = 'Item';

ToggleGroup.Item = Item;

const StyledItem = styled(RadixToggleGroup.Item, {
  all: 'unset',
  boxSizing: 'border-box',
  display: 'flex',
  placeItems: 'center',
  borderWidth: '$2',
  borderStyle: 'solid',
  fontWeight: '$medium',
  lineHeight: '$xs',
  cursor: 'pointer',
  userSelect: 'none',
  '&:first-child': {
    marginLeft: 0,
    borderTopLeftRadius: '$md',
    borderBottomLeftRadius: '$md',
  },
  '&:last-child': {
    borderTopRightRadius: '$md',
    borderBottomRightRadius: '$md',
  },
  variants: {
    variant: {
      solid: {
        '&:hover:enabled': {
          borderStyle: 'dashed',
        },
        '&[data-state=on]:enabled': {
          borderStyle: 'dashed',
        },
        '&:focus:enabled': {
          borderStyle: 'dashed',
        },
        '&:disabled': {
          opacity: 0.5,
          cursor: 'not-allowed',
        },
      },
      outline: {
        '&:hover:enabled': {
          borderStyle: 'dashed',
        },
        '&[data-state=on]:enabled': {
          borderStyle: 'dashed',
        },
        '&:focus:enabled': {
          borderStyle: 'dashed',
        },
        '&:disabled': {
          opacity: 0.5,
          cursor: 'not-allowed',
        },
      },
      ghost: {
        borderStyle: 'dashed',
        borderColor: 'transparent',
        backgroundColor: 'transparent',
        '&:disabled': {
          opacity: 0.5,
          cursor: 'not-allowed',
        },
      },
    },
    colorScheme: {
      slate: {},
      red: {},
      orange: {},
      yellow: {},
      green: {},
      blue: {},
      purple: {},
    },
    size: {
      xs: {
        width: '$7',
        height: '$7',
        '& > svg': {
          width: '$5',
          height: '$5',
        },
      },
      sm: {
        width: '$8',
        height: '$8',
        '& > svg': {
          width: '$6',
          height: '$6',
        },
      },
      md: {
        width: '$10',
        height: '$10',
        '& > svg': {
          width: '$7',
          height: '$7',
        },
      },
      lg: {
        width: '$12',
        height: '$12',
        '& > svg': {
          width: '$8',
          height: '$8',
        },
      },
      xl: {
        width: '$14',
        height: '$14',
        '& > svg': {
          width: '$9',
          height: '$9',
        },
      },
    },
  },
  compoundVariants: [
    {
      variant: 'solid',
      colorScheme: 'slate',
      css: {
        borderColor: '$slate-500',
        color: '$slate-50',
        backgroundColor: '$slate-600',
        '&:hover:enabled': {
          backgroundColor: '$slate-700',
        },
        '&[data-state=on]:enabled': {
          backgroundColor: '$slate-900',
        },
        '&:focus:enabled': {
          backgroundColor: '$slate-800',
        },
      },
    },
    {
      variant: 'solid',
      colorScheme: 'red',
      css: {
        borderColor: '$red-500',
        color: '$red-50',
        backgroundColor: '$red-600',
        '&:hover:enabled': {
          backgroundColor: '$red-700',
        },
        '&[data-state=on]:enabled': {
          backgroundColor: '$red-900',
        },
        '&:focus:enabled': {
          backgroundColor: '$red-800',
        },
      },
    },
    {
      variant: 'solid',
      colorScheme: 'orange',
      css: {
        borderColor: '$orange-500',
        color: '$orange-50',
        backgroundColor: '$orange-600',
        '&:hover:enabled': {
          backgroundColor: '$orange-700',
        },
        '&[data-state=on]:enabled': {
          backgroundColor: '$orange-900',
        },
        '&:focus:enabled': {
          backgroundColor: '$orange-800',
        },
      },
    },
    {
      variant: 'solid',
      colorScheme: 'yellow',
      css: {
        borderColor: '$yellow-500',
        color: '$yellow-50',
        backgroundColor: '$yellow-600',
        '&:hover:enabled': {
          backgroundColor: '$yellow-700',
        },
        '&[data-state=on]:enabled': {
          backgroundColor: '$yellow-900',
        },
        '&:focus:enabled': {
          backgroundColor: '$yellow-800',
        },
      },
    },
    {
      variant: 'solid',
      colorScheme: 'green',
      css: {
        borderColor: '$green-500',
        color: '$green-50',
        backgroundColor: '$green-600',
        '&:hover:enabled': {
          backgroundColor: '$green-700',
        },
        '&[data-state=on]:enabled': {
          backgroundColor: '$green-900',
        },
        '&:focus:enabled': {
          backgroundColor: '$green-800',
        },
      },
    },
    {
      variant: 'solid',
      colorScheme: 'blue',
      css: {
        borderColor: '$blue-500',
        color: '$blue-50',
        backgroundColor: '$blue-600',
        '&:hover:enabled': {
          backgroundColor: '$blue-700',
        },
        '&[data-state=on]:enabled': {
          backgroundColor: '$blue-900',
        },
        '&:focus:enabled': {
          backgroundColor: '$blue-800',
        },
      },
    },
    {
      variant: 'solid',
      colorScheme: 'purple',
      css: {
        borderColor: '$purple-500',
        color: '$purple-50',
        backgroundColor: '$purple-600',
        '&:hover:enabled': {
          backgroundColor: '$purple-700',
        },
        '&[data-state=on]:enabled': {
          backgroundColor: '$purple-900',
        },
        '&:focus:enabled': {
          backgroundColor: '$purple-800',
        },
      },
    },
    {
      variant: 'outline',
      colorScheme: 'slate',
      css: {
        borderColor: '$slate-500',
        color: '$slate-900',
        backgroundColor: '$slate-50',
        '&:hover:enabled': {
          backgroundColor: '$slate-200',
        },
        '&[data-state=on]:enabled': {
          backgroundColor: '$slate-400',
        },
        '&:focus:enabled': {
          backgroundColor: '$slate-300',
        },
      },
    },
    {
      variant: 'outline',
      colorScheme: 'red',
      css: {
        borderColor: '$red-500',
        color: '$red-900',
        backgroundColor: '$red-50',
        '&:hover:enabled': {
          backgroundColor: '$red-200',
        },
        '&[data-state=on]:enabled': {
          backgroundColor: '$red-400',
        },
        '&:focus:enabled': {
          backgroundColor: '$red-300',
        },
      },
    },
    {
      variant: 'outline',
      colorScheme: 'orange',
      css: {
        borderColor: '$orange-500',
        color: '$orange-900',
        backgroundColor: '$orange-50',
        '&:hover:enabled': {
          backgroundColor: '$orange-200',
        },
        '&[data-state=on]:enabled': {
          backgroundColor: '$orange-400',
        },
        '&:focus:enabled': {
          backgroundColor: '$orange-300',
        },
      },
    },
    {
      variant: 'outline',
      colorScheme: 'yellow',
      css: {
        borderColor: '$yellow-500',
        color: '$yellow-900',
        backgroundColor: '$yellow-50',
        '&:hover:enabled': {
          backgroundColor: '$yellow-200',
        },
        '&[data-state=on]:enabled': {
          backgroundColor: '$yellow-400',
        },
        '&:focus:enabled': {
          backgroundColor: '$yellow-300',
        },
      },
    },
    {
      variant: 'outline',
      colorScheme: 'green',
      css: {
        borderColor: '$green-500',
        color: '$green-900',
        backgroundColor: '$green-50',
        '&:hover:enabled': {
          backgroundColor: '$green-200',
        },
        '&[data-state=on]:enabled': {
          backgroundColor: '$green-400',
        },
        '&:focus:enabled': {
          backgroundColor: '$green-300',
        },
      },
    },
    {
      variant: 'outline',
      colorScheme: 'blue',
      css: {
        borderColor: '$blue-500',
        color: '$blue-900',
        backgroundColor: '$blue-50',
        '&:hover:enabled': {
          backgroundColor: '$blue-200',
        },
        '&[data-state=on]:enabled': {
          backgroundColor: '$blue-400',
        },
        '&:focus:enabled': {
          backgroundColor: '$blue-300',
        },
      },
    },
    {
      variant: 'outline',
      colorScheme: 'purple',
      css: {
        borderColor: '$purple-500',
        color: '$purple-900',
        backgroundColor: '$purple-50',
        '&:hover:enabled': {
          backgroundColor: '$purple-200',
        },
        '&[data-state=on]:enabled': {
          backgroundColor: '$purple-400',
        },
        '&:focus:enabled': {
          backgroundColor: '$purple-300',
        },
      },
    },
    {
      variant: 'ghost',
      colorScheme: 'slate',
      css: {
        color: '$slate-900',
        '&:hover:enabled': {
          borderColor: '$slate-500',
        },
        '&[data-state=on]:enabled': {
          backgroundColor: '$slate-300',
        },
        '&:focus:enabled': {
          borderColor: '$slate-500',
          backgroundColor: '$slate-200',
        },
      },
    },
    {
      variant: 'ghost',
      colorScheme: 'red',
      css: {
        color: '$red-900',
        '&:hover:enabled': {
          borderColor: '$red-500',
        },
        '&[data-state=on]:enabled': {
          backgroundColor: '$red-300',
        },
        '&:focus:enabled': {
          borderColor: '$red-500',
          backgroundColor: '$red-200',
        },
      },
    },
    {
      variant: 'ghost',
      colorScheme: 'orange',
      css: {
        color: '$orange-900',
        '&:hover:enabled': {
          borderColor: '$orange-500',
        },
        '&[data-state=on]:enabled': {
          backgroundColor: '$orange-300',
        },
        '&:focus:enabled': {
          borderColor: '$orange-500',
          backgroundColor: '$orange-200',
        },
      },
    },
    {
      variant: 'ghost',
      colorScheme: 'yellow',
      css: {
        color: '$yellow-900',
        '&:hover:enabled': {
          borderColor: '$yellow-500',
        },
        '&[data-state=on]:enabled': {
          backgroundColor: '$yellow-300',
        },
        '&:focus:enabled': {
          borderColor: '$yellow-500',
          backgroundColor: '$yellow-200',
        },
      },
    },
    {
      variant: 'ghost',
      colorScheme: 'green',
      css: {
        color: '$green-900',
        '&:hover:enabled': {
          borderColor: '$green-500',
        },
        '&[data-state=on]:enabled': {
          backgroundColor: '$green-300',
        },
        '&:focus:enabled': {
          borderColor: '$green-500',
          backgroundColor: '$green-200',
        },
      },
    },
    {
      variant: 'ghost',
      colorScheme: 'blue',
      css: {
        color: '$blue-900',
        '&:hover:enabled': {
          borderColor: '$blue-500',
        },
        '&[data-state=on]:enabled': {
          backgroundColor: '$blue-300',
        },
        '&:focus:enabled': {
          borderColor: '$blue-500',
          backgroundColor: '$blue-200',
        },
      },
    },
    {
      variant: 'ghost',
      colorScheme: 'purple',
      css: {
        color: '$purple-900',
        '&:hover:enabled': {
          borderColor: '$purple-500',
        },
        '&[data-state=on]:enabled': {
          backgroundColor: '$purple-300',
        },
        '&:focus:enabled': {
          borderColor: '$purple-500',
          backgroundColor: '$purple-200',
        },
      },
    },
  ],
  defaultVariants: {
    variant: 'outline',
    colorScheme: 'slate',
    size: 'sm',
  },
});
