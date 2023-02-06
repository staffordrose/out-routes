import { FC, useCallback, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { Button, Flex } from '@/components/atoms';
import { TextField } from '@/components/molecules';
import { User } from '@/types';

export type UserNameFormValues = {
  name: string;
};

export type UserNameFormProps = {
  user: Partial<User>;
  onSubmit: (
    values: UserNameFormValues,
    helpers: { reset: () => void }
  ) => void;
};

export const UserNameForm: FC<UserNameFormProps> = ({
  user,
  onSubmit: onSubmitHandler,
}) => {
  const { control, onSubmit } = useUserNameForm({
    user,
    onSubmit: onSubmitHandler,
  });

  return (
    <form onSubmit={onSubmit}>
      <Flex gap='lg' alignItems='center'>
        <Controller
          name='name'
          control={control}
          rules={{ maxLength: 60 }}
          render={({ field, fieldState: { isTouched, error } }) => (
            <TextField
              {...field}
              placeholder='John Doe'
              isTouched={isTouched}
              error={error?.message}
            />
          )}
        />
        <Button size='md' type='submit'>
          Submit
        </Button>
      </Flex>
    </form>
  );
};

const useUserNameForm = ({
  user,
  onSubmit: onSubmitHandler,
}: Pick<UserNameFormProps, 'user' | 'onSubmit'>) => {
  const validationSchema = useMemo(
    () =>
      yup.object({
        name: yup
          .string()
          .max(60, `Can't be longer than 60 characters`)
          .required(`Name is required`),
      }),
    []
  );

  const defaultValues = useMemo(() => mapPropsToValues(user), [user]);

  const { control, handleSubmit, reset } = useForm<UserNameFormValues>({
    defaultValues,
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = useCallback(
    (values: UserNameFormValues) => {
      onSubmitHandler(values, { reset });
    },
    [reset, onSubmitHandler]
  );

  return {
    control,
    onSubmit: handleSubmit(onSubmit),
  };
};

const mapPropsToValues = (user: UserNameFormProps['user']) => ({
  name: user.name || '',
});
