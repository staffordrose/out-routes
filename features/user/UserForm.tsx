import { FC, useCallback, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { TextareaField, TextField } from '@/components/molecules';
import { styled } from '@/styles';
import { User } from '@/types/users';

export type UserFormValues = {
  name: string;
  bio?: string;
  company?: string;
  location?: string;
};

export type UserFormProps = {
  user: Partial<User>;
  onSubmit: (values: UserFormValues, helpers: { reset: () => void }) => void;
};

export const UserForm: FC<UserFormProps> = ({
  user,
  onSubmit: onSubmitHandler,
}) => {
  const { control, onSubmit } = useUserForm({
    user,
    onSubmit: onSubmitHandler,
  });

  return (
    <form id='user-form' onSubmit={onSubmit}>
      <ResponsiveGrid>
        <Controller
          name='name'
          control={control}
          rules={{ maxLength: 60 }}
          render={({ field, fieldState: { isTouched, error } }) => (
            <TextField
              {...field}
              label='Name'
              placeholder='John Doe'
              isTouched={isTouched}
              error={error?.message}
            />
          )}
        />
        <Controller
          name='company'
          control={control}
          rules={{ maxLength: 120 }}
          render={({ field, fieldState: { isTouched, error } }) => (
            <TextField
              {...field}
              label='Company'
              placeholder='Business Inc.'
              isTouched={isTouched}
              error={error?.message}
            />
          )}
        />
        <Controller
          name='location'
          control={control}
          rules={{ maxLength: 120 }}
          render={({ field, fieldState: { isTouched, error } }) => (
            <TextField
              {...field}
              label='Location'
              placeholder='Denver, CO'
              isTouched={isTouched}
              error={error?.message}
            />
          )}
        />
      </ResponsiveGrid>
      <Controller
        name='bio'
        control={control}
        rules={{ maxLength: 256 }}
        render={({ field, fieldState: { isTouched, error } }) => (
          <TextareaField
            {...field}
            label='Biography'
            placeholder='I love the outdoors.'
            rows={4}
            isTouched={isTouched}
            error={error?.message}
          />
        )}
      />
    </form>
  );
};

const useUserForm = ({
  user,
  onSubmit: onSubmitHandler,
}: Pick<UserFormProps, 'user' | 'onSubmit'>) => {
  const validationSchema = useMemo(
    () =>
      yup.object({
        name: yup
          .string()
          .max(60, `Can't be longer than 60 characters`)
          .required(`Name is required`),
        bio: yup.string().max(256, `Can't be longer than 256 characters`),
        company: yup.string().max(120, `Can't be longer than 120 characters`),
        location: yup.string().max(120, `Can't be longer than 120 characters`),
      }),
    []
  );

  const defaultValues = useMemo(() => mapPropsToValues(user), [user]);

  const { control, handleSubmit, reset } = useForm<UserFormValues>({
    mode: 'onBlur',
    defaultValues,
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = useCallback(
    (values: UserFormValues) => {
      onSubmitHandler(values, { reset });
    },
    [reset, onSubmitHandler]
  );

  return {
    control,
    onSubmit: handleSubmit(onSubmit),
  };
};

const mapPropsToValues = (user: UserFormProps['user']) => ({
  name: user.name || '',
  bio: user.bio || '',
  company: user.company || '',
  location: user.location || '',
});

const ResponsiveGrid = styled('div', {
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '$2_5',
  marginBottom: '$2_5',
  '@sm': {
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '$3',
    marginBottom: '$3',
  },
  '@md': {
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '$3_5',
    marginBottom: '$3_5',
  },
  '@lg': {
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '$4',
    marginBottom: '$4',
  },
});
