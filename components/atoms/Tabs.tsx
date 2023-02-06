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
  tabs: Tab[];
  defaultValue?: string;
  value?: string;
  ariaLabel: string;
  contentMinHeight?: string | number;
  onValueChange?: (value: string) => void;
};

export const Tabs = forwardRef(
  (
    { tabs, value, ariaLabel, contentMinHeight, ...props }: TabsProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    return (
      <TabsRoot {...props} ref={ref} value={value}>
        <TabsList aria-label={ariaLabel}>
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
  borderBottomWidth: '$2',
  borderBottomStyle: 'solid',
  borderBottomColor: '$slate-500',
  whiteSpace: 'nowrap',
  MsOverflowStyle: 'none' /* Internet Explorer 10+ */,
  scrollbarWidth: 'none' /* Firefox */,
  '&::-webkit-scrollbar': {
    display: 'none' /* Safari and Chrome */,
  },
});

const TabsTrigger = styled(RadixTabs.Trigger, {
  flex: 1,
  display: 'flex',
  gap: '$3',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '$12',
  padding: '0 $3',
  borderWidth: '$2',
  borderBottomWidth: 0,
  borderStyle: 'solid',
  borderColor: 'transparent',
  borderRadius: 0,
  borderTopLeftRadius: '$md',
  borderTopRightRadius: '$md',
  fontFamily: '$heading',
  fontSize: '$xl',
  fontWeight: '$medium',
  lineHeight: '$xs',
  color: '$slate-900',
  backgroundColor: 'transparent',
  userSelect: 'none',
  cursor: 'pointer',
  '&:hover': {
    borderStyle: 'dashed',
    borderColor: '$slate-500',
    backgroundColor: '$slate-200',
  },
  '&[data-state="active"]': {
    borderColor: '$slate-500',
  },
  '&:focus': {
    borderStyle: 'dashed',
    borderColor: '$slate-500',
    backgroundColor: '$slate-300',
  },
  '&:disabled': {
    borderStyle: 'solid',
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
  paddingY: '$4',
  outline: 'none',
});
