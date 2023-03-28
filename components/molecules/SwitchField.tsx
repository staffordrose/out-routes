import {
  ComponentPropsWithoutRef,
  FormEvent,
  ForwardedRef,
  forwardRef,
  ReactNode,
} from 'react';
import ReactIs from 'react-is';

import { styled } from '@/styles';
import { Flex, Label, Switch, Text } from '../atoms';

export type SwitchFieldProps = ComponentPropsWithoutRef<typeof Switch> & {
  id?: string;
  label?: ReactNode;
  valueLabel?: ReactNode;
  defaultChecked?: boolean;
  onChange: (value: boolean) => void;
  isTouched?: boolean;
  error?: string;
};

export const SwitchField = forwardRef(
  (
    {
      label,
      valueLabel,
      defaultChecked,
      onChange,
      isTouched,
      error,
      ...switchProps
    }: SwitchFieldProps,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const isError = isTouched && !!error;

    return (
      <StyledSwitchField>
        {ReactIs.isValidElementType(label) && (
          <Label htmlFor={switchProps.id || switchProps.name}>{label}</Label>
        )}
        <Flex gap='sm' justifyContent='flex-start' alignItems='center'>
          <Switch
            ref={ref}
            {...switchProps}
            defaultChecked={defaultChecked}
            onCheckedChange={onChange}
            isError={isError}
          />
          {valueLabel ? (
            typeof valueLabel === 'string' ? (
              <span>{valueLabel}</span>
            ) : (
              valueLabel
            )
          ) : null}
        </Flex>
        {isError && (
          <Text fontSize='sm' colorScheme='red' colorScale={700}>
            {error}
          </Text>
        )}
      </StyledSwitchField>
    );
  }
);

SwitchField.displayName = 'SwitchField';

const StyledSwitchField = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  flexWrap: 'wrap',
  gap: '$1',
  justifyContent: 'center',
  width: '$full',
});
