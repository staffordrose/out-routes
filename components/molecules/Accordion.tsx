import {
  ComponentPropsWithoutRef,
  ForwardedRef,
  forwardRef,
  ReactNode,
} from 'react';
import * as RadixAccordion from '@radix-ui/react-accordion';
import { keyframes } from '@stitches/react';
import { BiChevronDown } from 'react-icons/bi';

import { styled } from '@/styles';

type Variant = 'outline' | 'ghost';
type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

type AccordionItem = {
  value: string;
  trigger: ReactNode;
  content: ReactNode;
};

export type AccordionProps = ComponentPropsWithoutRef<
  typeof StyledAccordion
> & {
  variant?: Variant;
  size?: Size;
  type: 'single';
  defaultValue?: string;
  collapsible?: boolean;
  items: AccordionItem[];
};

export const Accordion = forwardRef(
  (
    {
      variant,
      size,
      type,
      defaultValue,
      collapsible = true,
      items,
      ...accordionProps
    }: AccordionProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    return (
      <StyledAccordion
        {...accordionProps}
        ref={ref}
        type={type}
        defaultValue={defaultValue}
        collapsible={collapsible}
      >
        {items.map(({ value, trigger, content }) => {
          return (
            <AccordionItem key={value} value={value}>
              <AccordionTrigger variant={variant} size={size}>
                {trigger}
              </AccordionTrigger>
              <AccordionContent size={size}>{content}</AccordionContent>
            </AccordionItem>
          );
        })}
      </StyledAccordion>
    );
  }
);

Accordion.displayName = 'Accordion';

const StyledAccordion = styled(RadixAccordion.Root);

const AccordionItem = styled(RadixAccordion.Item, {
  overflow: 'hidden',
  marginTop: '$px',

  '&:first-child': {
    marginTop: 0,
    borderTopLeftRadius: '$md',
    borderTopRightRadius: '$md',
  },

  '&:last-child': {
    borderBottomLeftRadius: '$md',
    borderBottomRightRadius: '$md',
  },

  '&:focus-within': {
    position: 'relative',
    zIndex: 1,
  },
});

// AccordionTrigger
type AccordionTriggerProps = {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
};

const AccordionTrigger = forwardRef(
  (
    { children, ...props }: AccordionTriggerProps,
    ref: ForwardedRef<HTMLButtonElement>
  ) => {
    return (
      <StyledHeader>
        <StyledTrigger {...props} ref={ref}>
          {children}
          <StyledChevron aria-hidden />
        </StyledTrigger>
      </StyledHeader>
    );
  }
);

AccordionTrigger.displayName = 'AccordionTrigger';

const StyledHeader = styled(RadixAccordion.Header, {
  all: 'unset',
  display: 'flex',
});

const StyledTrigger = styled(RadixAccordion.Trigger, {
  all: 'unset',
  boxSizing: 'border-box',
  flex: 1,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '$full',
  height: '$auto',
  borderWidth: '$2',
  borderStyle: 'solid',
  borderRadius: '$md',
  padding: '0 $5',
  fontFamily: '$heading',
  fontWeight: '$medium',
  lineHeight: '$xs',
  cursor: 'pointer',
  userSelect: 'none',
  variants: {
    variant: {
      outline: {
        borderColor: '$slate-500',
        color: '$slate-900',
        backgroundColor: '$slate-50',
        '&:hover': {
          borderStyle: 'dashed',
          backgroundColor: '$slate-200',
        },
        '&:focus': {
          borderStyle: 'dashed',
          backgroundColor: '$slate-300',
        },
        '&:disabled': {
          borderStyle: 'solid',
          backgroundColor: '$slate-50',
          opacity: 0.5,
          cursor: 'not-allowed',
        },
      },
      ghost: {
        borderStyle: 'dashed',
        borderColor: 'transparent',
        color: '$slate-900',
        backgroundColor: 'transparent',
        '&:hover': {
          borderColor: '$slate-500',
        },
        '&:focus': {
          borderColor: '$slate-500',
          backgroundColor: '$slate-200',
        },
        '&:disabled': {
          borderColor: 'transparent',
          backgroundColor: 'transparent',
          opacity: 0.5,
          cursor: 'not-allowed',
        },
      },
    },
    size: {
      xs: {
        gap: '$2',
        minHeight: '$7',
        padding: '0 $2',
        fontSize: '$sm',
        '& > svg': {
          width: '$5',
          height: '$5',
        },
      },
      sm: {
        gap: '$2',
        minHeight: '$8',
        padding: '0 $2',
        fontSize: '$md',
        '& > svg': {
          width: '$6',
          height: '$6',
        },
      },
      md: {
        gap: '$2_5',
        minHeight: '$10',
        padding: '0 $2_5',
        fontSize: '$lg',
        '& > svg': {
          width: '$7',
          height: '$7',
        },
      },
      lg: {
        gap: '$3',
        minHeight: '$12',
        padding: '0 $3',
        fontSize: '$xl',
        '& > svg': {
          width: '$8',
          height: '$8',
        },
      },
      xl: {
        gap: '$3_5',
        minHeight: '$14',
        padding: '0 $3_5',
        fontSize: '$2xl',
        '& > svg': {
          width: '$9',
          height: '$9',
        },
      },
    },
  },
  defaultVariants: {
    variant: 'ghost',
    size: 'md',
  },
});

const StyledChevron = styled(BiChevronDown, {
  transition: 'transform 300ms cubic-bezier(0.87, 0, 0.13, 1)',
  '[data-state=open] &': { transform: 'rotate(180deg)' },
});

// AccordionContent
type AccordionContentProps = {
  size?: Size;
  children: ReactNode;
};

const AccordionContent = forwardRef(
  (
    { children, ...props }: AccordionContentProps,
    forwardedRef: ForwardedRef<HTMLDivElement>
  ) => {
    return (
      <StyledContent {...props} ref={forwardedRef}>
        {children}
      </StyledContent>
    );
  }
);

AccordionContent.displayName = 'AccordionContent';

const slideDown = keyframes({
  from: { height: 0 },
  to: { height: 'var(--radix-accordion-content-height)' },
});

const slideUp = keyframes({
  from: { height: 'var(--radix-accordion-content-height)' },
  to: { height: 0 },
});

const StyledContent = styled(RadixAccordion.Content, {
  overflow: 'hidden',
  fontSize: 'sm',
  color: '$slate-900',
  backgroundColor: '$slate-50',
  '&[data-state="open"]': {
    animation: `${slideDown} 300ms cubic-bezier(0.87, 0, 0.13, 1)`,
  },
  '&[data-state="closed"]': {
    animation: `${slideUp} 300ms cubic-bezier(0.87, 0, 0.13, 1)`,
  },
  variants: {
    size: {
      xs: {
        padding: '$2',
      },
      sm: {
        padding: '$2',
      },
      md: {
        padding: '$2_5',
      },
      lg: {
        padding: '$3',
      },
      xl: {
        padding: '$3_5',
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});
