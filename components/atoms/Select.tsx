import {
  ComponentPropsWithoutRef,
  ElementType,
  Fragment,
  ForwardedRef,
  forwardRef,
  ReactNode,
} from 'react';
import * as RadixSelect from '@radix-ui/react-select';
import type * as Stitches from '@stitches/react';
import { BiCheck, BiChevronDown, BiChevronUp } from 'react-icons/bi';

import { styled } from '@/styles';

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
  placeholder?: string;
  groups: SelectGroup[];
};

export const Select = forwardRef(
  (
    { size, placeholder = '', value, groups, ...selectProps }: SelectProps,
    ref: ForwardedRef<HTMLButtonElement>
  ) => {
    return (
      <StyledSelect {...selectProps} value={value}>
        <SelectTrigger ref={ref} aria-label={value} size={size}>
          <RadixSelect.Value placeholder={placeholder} />
          <SelectIcon>
            <BiChevronDown />
          </SelectIcon>
        </SelectTrigger>
        <RadixSelect.Portal>
          <SelectContent>
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
  placeItems: 'center',
  width: '$full',
  padding: '0 $2',
  borderWidth: '$2',
  borderStyle: 'solid',
  borderColor: '$slate-300',
  borderRadius: '$md',
  lineHeight: '$sm',
  color: '$slate-900',
  backgroundColor: 'transparent',
  '&:hover': {
    borderColor: '$slate-700',
    backgroundColor: '$slate-50',
  },
  '&:focus': {
    borderColor: '$slate-700',
    backgroundColor: '$slate-50',
    outlineWidth: '$2',
    outlineStyle: 'dashed',
    outlineColor: '$slate-500',
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
  minWidth: '$56',
  borderWidth: '$2',
  borderStyle: 'dashed',
  borderColor: '$slate-500',
  borderRadius: '$lg',
  backgroundColor: '$slate-50',
  boxShadow:
    '0px 10px 38px -10px rgba(22, 23, 24, 0.35), 0px 10px 20px -15px rgba(22, 23, 24, 0.2)',
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
    color: '$gray-900',
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
