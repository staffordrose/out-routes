import {
  ComponentPropsWithoutRef,
  ElementType,
  ForwardedRef,
  ReactNode,
  forwardRef,
} from 'react';
import * as RadixTabs from '@radix-ui/react-tabs';
import type * as Stitches from '@stitches/react';

import { styled } from '@/styles';

export type Tab = {
  value: string;
  label: string;
  children: ReactNode;
};

export type TabsProps = ComponentPropsWithoutRef<typeof TabsRoot> & {
  as?: ElementType;
  css?: Stitches.CSS;
  justify?: 'left' | 'center' | 'right';
  tabs: Tab[];
  defaultValue?: string;
  value?: string;
  ariaLabel: string;
  contentMinHeight?: string | number;
  onValueChange?: (value: string) => void;
};

export const Tabs = forwardRef(
  (
    { justify, tabs, value, ariaLabel, contentMinHeight, ...props }: TabsProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    return (
      <TabsRoot {...props} ref={ref} value={value}>
        <TabsList justify={justify} aria-label={ariaLabel}>
          {tabs.map(({ value, label }) => {
            return (
              <TabsTrigger key={value} value={value}>
                {label}
              </TabsTrigger>
            );
          })}
        </TabsList>
        {tabs.map(({ value, children }) => {
          return (
            <TabsContent
              key={value}
              value={value}
              css={{ minHeight: contentMinHeight }}
            >
              {children}
            </TabsContent>
          );
        })}
      </TabsRoot>
    );
  }
);

Tabs.displayName = 'Tabs';

const TabsRoot = styled(RadixTabs.Root, {
  width: '$full',
});

const TabsList = styled(RadixTabs.List, {
  flexShrink: 0,
  overflowX: 'auto',
  overflowY: 'hidden',
  display: 'flex',
  borderBottomWidth: '$1',
  borderBottomStyle: 'solid',
  borderBottomColor: '$slate-200',
  whiteSpace: 'nowrap',
  MsOverflowStyle: 'none' /* Internet Explorer 10+ */,
  scrollbarWidth: 'none' /* Firefox */,
  '&::-webkit-scrollbar': {
    display: 'none' /* Safari and Chrome */,
  },
  variants: {
    justify: {
      left: {
        '& > *:last-child': {
          marginRight: 'auto',
        },
      },
      center: {
        '& > *:first-child': {
          marginLeft: 'auto',
        },
        '& > *:last-child': {
          marginRight: 'auto',
        },
      },
      right: {
        '& > *:first-child': {
          marginLeft: 'auto',
        },
      },
    },
  },
  defaultVariants: {
    justify: 'left',
  },
});

const TabsTrigger = styled(RadixTabs.Trigger, {
  display: 'flex',
  gap: '$3',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '$12',
  padding: '0 $3',
  border: 'none',
  borderTopWidth: '$4',
  borderTopStyle: 'solid',
  borderTopColor: 'transparent',
  borderBottomWidth: '$4',
  borderBottomStyle: 'solid',
  borderBottomColor: 'transparent',
  borderRadius: 0,
  fontFamily: '$heading',
  fontSize: '$xl',
  fontWeight: '$medium',
  lineHeight: '$xs',
  color: '$slate-900',
  backgroundColor: 'transparent',
  userSelect: 'none',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '$slate-100',
  },
  '&[data-state="active"]': {
    borderBottomColor: '$orange-500',
  },
  '&:focus': {
    backgroundColor: '$slate-100',
  },
  '&:disabled': {
    backgroundColor: 'transparent',
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  '& > svg': {
    width: '$8',
    height: '$8',
  },
});

const TabsContent = styled(RadixTabs.Content, {
  flexGrow: 1,
  minHeight: '$64',
  outline: 'none',
});
