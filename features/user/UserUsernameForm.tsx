import { FC, useCallback, useEffect, useMemo } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { TextField } from '@/components/molecules';
import { useDebounce } from '@/hooks';
import { checkIfUsernameExists } from '@/lib/v1/api/users';
import { styled } from '@/styles';
import { User } from '@/types';

export type UserUsernameFormValues = {
  username: string;
};

export type UserUsernameFormProps = {
  user: Partial<User>;
  onSubmit: (
    values: UserUsernameFormValues,
    helpers: { reset: () => void }
  ) => void;
};

export const UserUsernameForm: FC<UserUsernameFormProps> = ({
  user,
  onSubmit: onSubmitHandler,
}) => {
  const { control, onSubmit } = useUserUsernameForm({
    user,
    onSubmit: onSubmitHandler,
  });

  return (
    <form id='user-username-form' onSubmit={onSubmit}>
      <ResponsiveGrid>
        <Controller
          name='username'
          control={control}
          rules={{ minLength: 8, maxLength: 20 }}
          render={({ field, fieldState: { isTouched, error } }) => (
            <TextField
              {...field}
              label='Username'
              placeholder='johndoe'
              isTouched={isTouched}
              error={error?.message}
            />
          )}
        />
      </ResponsiveGrid>
    </form>
  );
};

const useUserUsernameForm = ({
  user,
  onSubmit: onSubmitHandler,
}: Pick<UserUsernameFormProps, 'user' | 'onSubmit'>) => {
  const validationSchema = useMemo(
    () =>
      yup.object({
        username: yup
          .string()
          .min(8, `Must be at least 8 characters`)
          .max(20, `Must be less than 20 characters`)
          .required(`Username is required`)
          .test(`Unique Username`, `Username is already in use`, (value) => {
            return new Promise((resolve) => {
              checkIfUsernameExists(value)
                .then(() => {
                  resolve(true);
                })
                .catch(() => {
                  resolve(false);
                });
            });
          }),
      }),
    []
  );

  const defaultValues = useMemo(() => mapPropsToValues(user), [user]);

  const { control, handleSubmit, trigger, reset } =
    useForm<UserUsernameFormValues>({
      defaultValues,
      resolver: yupResolver(validationSchema),
    });

  const watchUsername = useWatch({
    control,
    name: 'username',
  });

  const debouncedUsername = useDebounce(watchUsername, 300);

  useEffect(() => {
    const handler = async () => {
      await trigger('username');
    };

    if (debouncedUsername?.length >= 8) {
      handler();
    }
  }, [trigger, debouncedUsername]);

  const onSubmit = useCallback(
    (values: UserUsernameFormValues) => {
      onSubmitHandler(values, { reset });
    },
    [reset, onSubmitHandler]
  );

  return {
    control,
    onSubmit: handleSubmit(onSubmit),
  };
};

const mapPropsToValues = (user: UserUsernameFormProps['user']) => ({
  username: user.username || '',
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
