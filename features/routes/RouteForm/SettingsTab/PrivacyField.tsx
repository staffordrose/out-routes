import { FC } from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import { BiInfoCircle, BiLock, BiLockOpen } from 'react-icons/bi';

import { Callout, Flex, Icon } from '@/components/atoms';
import { SwitchField } from '@/components/molecules';
import { styled } from '@/styles';
import { RouteFormValues } from '../helpers';

type PrivacyFieldProps = {
  control: UseFormReturn<RouteFormValues>['control'];
  setValue: UseFormReturn<RouteFormValues>['setValue'];
};

export const PrivacyField: FC<PrivacyFieldProps> = ({ control, setValue }) => {
  return (
    <StyledPrivacyField>
      <Callout colorScheme='blue'>
        <BiInfoCircle />
        <span>You can add collaborators to private routes (coming soon)</span>
      </Callout>
      <Controller
        name='route.is_private'
        control={control}
        render={({ field, fieldState: { isTouched, error } }) => (
          <SwitchField
            {...field}
            label='Privacy'
            valueLabel={
              <Flex gap='xs' alignItems='center'>
                <Icon as={field.value === 'private' ? BiLock : BiLockOpen} />
                <span>{field.value === 'private' ? 'Private' : 'Public'}</span>
              </Flex>
            }
            defaultChecked={field.value === 'private'}
            onChange={(value) => {
              setValue('route.is_private', value ? 'private' : 'public');
            }}
            isTouched={isTouched}
            error={error?.message}
          />
        )}
      />
    </StyledPrivacyField>
  );
};

const StyledPrivacyField = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$2_5',
  width: '$full',
});
