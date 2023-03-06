import {
  ComponentPropsWithoutRef,
  ForwardedRef,
  forwardRef,
  ForwardRefExoticComponent,
  ReactNode,
  RefAttributes,
} from 'react';
import * as RadixDropdownMenu from '@radix-ui/react-dropdown-menu';
import { keyframes } from '@stitches/react';

import { styled } from '@/styles';

type DropdownMenuProps = ComponentPropsWithoutRef<
  typeof RadixDropdownMenu.Trigger
> & {
  side?: 'top' | 'right' | 'bottom' | 'left';
  sideOffset?: number;
  align?: 'start' | 'end';
  items: ReactNode[];
  children: ReactNode;
};

type DropdownMenuComponent = ForwardRefExoticComponent<
  DropdownMenuProps & RefAttributes<HTMLButtonElement>
> & {
  Header: ForwardRefExoticComponent<
    DropdownMenuHeaderProps & RefAttributes<HTMLDivElement>
  >;
  Item: ForwardRefExoticComponent<
    DropdownMenuItemProps & RefAttributes<HTMLDivElement>
  >;
  Separator: ForwardRefExoticComponent<
    DropdownMenuSeparatorProps & RefAttributes<HTMLDivElement>
  >;
};

export const DropdownMenu = forwardRef(
  (
    {
      side = 'bottom',
      sideOffset = 0,
      align = 'end',
      items,
      children,
    }: DropdownMenuProps,
    ref: ForwardedRef<HTMLButtonElement>
  ) => {
    return (
      <RadixDropdownMenu.Root>
        <RadixDropdownMenu.Trigger ref={ref} asChild>
          {children}
        </RadixDropdownMenu.Trigger>
        <RadixDropdownMenu.Portal>
          <DropdownMenuContent
            side={side}
            sideOffset={sideOffset}
            align={align}
          >
            <DropdownMenuArrow />
            <DropdownMenuContentBody>{items}</DropdownMenuContentBody>
          </DropdownMenuContent>
        </RadixDropdownMenu.Portal>
      </RadixDropdownMenu.Root>
    );
  }
) as DropdownMenuComponent;

DropdownMenu.displayName = 'DropdownMenu';

const slideUpAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateY(2px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' },
});

const slideRightAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateX(-2px)' },
  '100%': { opacity: 1, transform: 'translateX(0)' },
});

const slideDownAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateY(-2px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' },
});

const slideLeftAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateX(2px)' },
  '100%': { opacity: 1, transform: 'translateX(0)' },
});

const DropdownMenuContent = styled(RadixDropdownMenu.Content, {
  zIndex: '$menu',
  minWidth: '$56',
  borderWidth: '$1',
  borderStyle: 'solid',
  borderColor: '$slate-500',
  borderRadius: '$lg',
  boxShadow:
    '0px 7.5px 15px -7.5px $colors$slate-900-25, 0px 7.5px 15px -7.5px $colors$slate-900-50',
  animationDuration: '400ms',
  animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
  willChange: 'transform, opacity',
  '&[data-state="open"]': {
    '&[data-side="top"]': { animationName: slideDownAndFade },
    '&[data-side="right"]': { animationName: slideLeftAndFade },
    '&[data-side="bottom"]': { animationName: slideUpAndFade },
    '&[data-side="left"]': { animationName: slideRightAndFade },
  },
});

const DropdownMenuArrow = styled(RadixDropdownMenu.Arrow, {
  width: '$3',
  height: '$2',
  fill: '$slate-500',
});

const DropdownMenuContentBody = styled('div', {
  overflow: 'hidden',
  width: '$full',
  borderRadius: '$lg',
  backgroundColor: '$slate-50',
});

// Header
type DropdownMenuHeaderProps = ComponentPropsWithoutRef<
  typeof StyledDropdownMenuHeader
>;

const DropdownMenuHeader = forwardRef(
  (props: DropdownMenuHeaderProps, ref: ForwardedRef<HTMLDivElement>) => {
    return <StyledDropdownMenuHeader ref={ref} {...props} />;
  }
);

DropdownMenuHeader.displayName = 'DropdownMenuHeader';

DropdownMenu.Header = DropdownMenuHeader;

const StyledDropdownMenuHeader = styled(RadixDropdownMenu.Label, {
  fontSize: '$sm',
  color: '$slate-500',
});

// Item
type DropdownMenuItemProps = ComponentPropsWithoutRef<
  typeof StyledDropdownMenuItem
> & {
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

const DropdownMenuItem = forwardRef(
  (props: DropdownMenuItemProps, ref: ForwardedRef<HTMLDivElement>) => {
    return <StyledDropdownMenuItem ref={ref} {...props} />;
  }
);

DropdownMenuItem.displayName = 'DropdownMenuItem';

DropdownMenu.Item = DropdownMenuItem;

const StyledDropdownMenuItem = styled(RadixDropdownMenu.Item, {
  all: 'unset',
  boxSizing: 'border-box',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  width: '$full',
  height: '$auto',
  padding: '0 $2',
  fontSize: '$sm',
  lineHeight: '$xs',
  color: '$slate-900',
  cursor: 'pointer',
  userSelect: 'none',
  '&[data-disabled]': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  variants: {
    colorScheme: {
      slate: {
        color: '$slate-900',
        '&[data-highlighted]': {
          backgroundColor: '$slate-200',
        },
      },
      red: {
        color: '$red-900',
        '&[data-highlighted]': {
          backgroundColor: '$red-200',
        },
      },
      orange: {
        color: '$orange-900',
        '&[data-highlighted]': {
          backgroundColor: '$orange-200',
        },
      },
      yellow: {
        color: '$yellow-900',
        '&[data-highlighted]': {
          backgroundColor: '$yellow-200',
        },
      },
      green: {
        color: '$green-900',
        '&[data-highlighted]': {
          backgroundColor: '$green-200',
        },
      },
      blue: {
        color: '$blue-900',
        '&[data-highlighted]': {
          backgroundColor: '$blue-200',
        },
      },
      purple: {
        color: '$purple-900',
        '&[data-highlighted]': {
          backgroundColor: '$purple-200',
        },
      },
    },
    size: {
      xs: {
        gap: '$2',
        minHeight: '$7',
        paddingX: '$2',
        fontSize: '$sm',
        '& > svg': {
          flexShrink: 0,
          width: '$5',
          height: '$5',
        },
      },
      sm: {
        gap: '$2',
        minHeight: '$8',
        paddingX: '$2',
        fontSize: '$md',
        '& > svg': {
          flexShrink: 0,
          width: '$6',
          height: '$6',
        },
      },
      md: {
        gap: '$2_5',
        minHeight: '$10',
        paddingX: '$2_5',
        fontSize: '$lg',
        '& > svg': {
          flexShrink: 0,
          width: '$7',
          height: '$7',
        },
      },
      lg: {
        gap: '$3',
        minHeight: '$12',
        paddingX: '$3',
        fontSize: '$xl',
        '& > svg': {
          flexShrink: 0,
          width: '$8',
          height: '$8',
        },
      },
      xl: {
        gap: '$3_5',
        minHeight: '$14',
        paddingX: '$3_5',
        fontSize: '$2xl',
        '& > svg': {
          flexShrink: 0,
          width: '$9',
          height: '$9',
        },
      },
    },
  },
  defaultVariants: {
    colorScheme: 'slate',
    size: 'sm',
  },
});

// Separator
type DropdownMenuSeparatorProps = ComponentPropsWithoutRef<
  typeof StyledDropdownMenuSeparator
>;

const DropdownMenuSeparator = forwardRef(
  (props: DropdownMenuSeparatorProps, ref: ForwardedRef<HTMLDivElement>) => {
    return <StyledDropdownMenuSeparator ref={ref} {...props} />;
  }
);

DropdownMenuSeparator.displayName = 'DropdownMenuSeparator';

DropdownMenu.Separator = DropdownMenuSeparator;

const StyledDropdownMenuSeparator = styled(RadixDropdownMenu.Separator, {
  height: '$px',
  // margin: '$2 0',
  margin: 0,
  backgroundColor: '$slate-200',
});
