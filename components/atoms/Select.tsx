import {
  ComponentPropsWithoutRef,
  ElementType,
  Fragment,
  ForwardedRef,
  forwardRef,
  ReactNode,
} from 'react';
// TODO: Add back once issue #1795 is fixed
// import * as RadixSelect from '@radix-ui/react-select';
import type * as Stitches from '@stitches/react';
import { BiCheck, BiChevronDown, BiChevronUp } from 'react-icons/bi';

import { styled } from '@/styles';
import * as RadixSelect from '../utility/Select';

type SelectOption = {
  label: ReactNode;
  value: string;
};

type SelectGroup = {
  id: string;
  label?: string;
  options: SelectOption[];
};

export type SelectProps = ComponentPropsWithoutRef<typeof StyledSelect> & {
  as?: ElementType;
  css?: Stitches.CSS;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  contentWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  placeholder?: string;
  isError?: boolean;
  groups: SelectGroup[];
};

export const Select = forwardRef(
  (
    {
      size,
      contentWidth,
      placeholder = '',
      isError,
      value,
      groups,
      ...selectProps
    }: SelectProps,
    ref: ForwardedRef<HTMLButtonElement>
  ) => {
    return (
      <StyledSelect {...selectProps} value={value}>
        <SelectTrigger
          ref={ref}
          aria-label={value}
          size={size}
          isError={isError}
        >
          <RadixSelect.Value placeholder={placeholder} />
          <SelectIcon>
            <BiChevronDown />
          </SelectIcon>
        </SelectTrigger>
        <RadixSelect.Portal>
          <SelectContent width={contentWidth}>
            <SelectScrollUpButton>
              <BiChevronUp />
            </SelectScrollUpButton>
            <SelectViewport>
              {Array.isArray(groups) &&
                groups.length > 0 &&
                groups.map(({ id, label, options }, index) => {
                  return (
                    <Fragment key={id}>
                      <RadixSelect.Group>
                        {!!label && <SelectLabel>{label}</SelectLabel>}
                        {Array.isArray(options) &&
                          options.length > 0 &&
                          options.map(({ value, label }) => {
                            return (
                              <Option key={value} value={value}>
                                {label}
                              </Option>
                            );
                          })}
                      </RadixSelect.Group>
                      {index < groups.length - 1 && <SelectSeparator />}
                    </Fragment>
                  );
                })}
            </SelectViewport>
            <SelectScrollDownButton>
              <BiChevronDown />
            </SelectScrollDownButton>
          </SelectContent>
        </RadixSelect.Portal>
      </StyledSelect>
    );
  }
);

Select.displayName = 'Select';

const StyledSelect = styled(RadixSelect.Root);

const SelectTrigger = styled(RadixSelect.SelectTrigger, {
  all: 'unset',
  boxSizing: 'border-box',
  display: 'inline-flex',
  gap: '$2',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '$full',
  padding: '0 $2',
  borderWidth: '$1',
  borderStyle: 'solid',
  borderColor: '$slate-300',
  borderRadius: '$md',
  lineHeight: '$sm',
  color: '$slate-900',
  backgroundColor: 'transparent',
  cursor: 'pointer',
  '&:hover:enabled': {
    borderColor: '$slate-700',
    backgroundColor: '$slate-50',
  },
  '&:focus:enabled': {
    borderColor: '$slate-700',
    backgroundColor: '$slate-50',
    outlineWidth: '$1',
    outlineStyle: 'solid',
    outlineColor: '$blue-300',
  },
  '&:disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  '&[data-placeholder]': {
    color: '$slate-500',
  },
  variants: {
    size: {
      xs: {
        height: '$7',
        fontSize: '$sm',
      },
      sm: {
        height: '$8',
        fontSize: '$md',
      },
      md: {
        height: '$10',
        fontSize: '$lg',
      },
      lg: {
        height: '$12',
        fontSize: '$xl',
      },
      xl: {
        height: '$14',
        fontSize: '$2xl',
      },
    },
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
      },
    },
  },
  defaultVariants: {
    size: 'sm',
  },
});

const SelectIcon = styled(RadixSelect.SelectIcon, {
  color: '$slate-900',
});

const SelectContent = styled(RadixSelect.Content, {
  zIndex: '$menu',
  overflow: 'hidden',
  borderWidth: '$1',
  borderStyle: 'solid',
  borderColor: '$slate-500',
  borderRadius: '$lg',
  backgroundColor: '$slate-50',
  boxShadow:
    '0px 15px 30px -15px $colors$slate-900-25, 0px 15px 30px -15px $colors$slate-900-50',
  variants: {
    width: {
      xs: { minWidth: '$40', maxWidth: '$48' },
      sm: { minWidth: '$48', maxWidth: '$56' },
      md: { minWidth: '$56', maxWidth: '$64' },
      lg: { minWidth: '$64', maxWidth: '$72' },
      xl: { minWidth: '$72', maxWidth: '$80' },
    },
  },
  defaultVariants: {
    width: 'md',
  },
});

const SelectViewport = styled(RadixSelect.Viewport, {
  padding: '$2',
});

// Option
type OptionProps = ComponentPropsWithoutRef<typeof StyledOption> & {
  as?: ElementType;
  css?: Stitches.CSS;
};

const Option = forwardRef(
  (
    { children, ...optionProps }: OptionProps,
    ref: ForwardedRef<HTMLOptionElement>
  ) => {
    return (
      <StyledOption {...optionProps} ref={ref}>
        <RadixSelect.ItemText>{children}</RadixSelect.ItemText>
        <StyledItemIndicator>
          <BiCheck />
        </StyledItemIndicator>
      </StyledOption>
    );
  }
);

Option.displayName = 'Option';

const StyledOption = styled(RadixSelect.Item, {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  height: '$7',
  padding: '0 $2 0 $6_5',
  borderRadius: '$md',
  fontSize: '$sm',
  lineHeight: '$sm',
  color: '$slate-900',
  cursor: 'pointer',
  userSelect: 'none',
  '&[data-disabled]': {
    opacity: 0.5,
    pointerEvents: 'none',
  },
  '&[data-highlighted]': {
    backgroundColor: '$slate-200',
  },
});

const SelectLabel = styled(RadixSelect.Label, {
  padding: '0 $6',
  fontSize: '$xs',
  lineHeight: '$xl',
  color: '$slate-700',
});

const SelectSeparator = styled(RadixSelect.Separator, {
  height: '$px',
  margin: '$2 0',
  backgroundColor: '$slate-200',
});

const StyledItemIndicator = styled(RadixSelect.ItemIndicator, {
  position: 'absolute',
  left: 0,
  display: 'inline-flex',
  placeItems: 'center',
  width: '$6',
});

const scrollButtonStyles = {
  display: 'flex',
  placeItems: 'center',
  height: '$6',
  color: '$slate-900',
  backgroundColor: '$slate-50',
  cursor: 'default',
};

const SelectScrollUpButton = styled(
  RadixSelect.ScrollUpButton,
  scrollButtonStyles
);

const SelectScrollDownButton = styled(
  RadixSelect.ScrollDownButton,
  scrollButtonStyles
);
