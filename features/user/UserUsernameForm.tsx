import { FC, useCallback, useEffect, useMemo } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { TextField } from '@/components/molecules';
import { useDebounce } from '@/hooks';
import { checkIfUsernameExists } from '@/lib/v1/api/users';
import { styled } from '@/styles';
import { User } from '@/types/users';

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
      <Container>
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
      </Container>
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
      mode: 'onBlur',
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

const Container = styled('div', {
  display: 'grid',
  justifyItems: 'start',
  width: '$full',
  maxWidth: '$64',
});
