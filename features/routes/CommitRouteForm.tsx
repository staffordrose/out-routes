import { FC, useCallback, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { BiSave } from 'react-icons/bi';

import { Button, Flex } from '@/components/atoms';
import { Feedback } from '@/components/layout';
import { TextField } from '@/components/molecules';
import { styled } from '@/styles';
import { CompareCommitItem } from '@/types';
import { CommitItemsList } from './CommitItemsList';

export type CommitRouteFormValues = {
  title: string;
};

export type CommitRouteFormProps = {
  commitItems: CompareCommitItem[];
  onSubmit: (
    values: CommitRouteFormValues,
    helpers: { reset: () => void }
  ) => void;
};

export const CommitRouteForm: FC<CommitRouteFormProps> = ({
  commitItems,
  onSubmit: onSubmitHandler,
}) => {
  const { control, formState, onSubmit } = useCommitRouteForm({
    onSubmit: onSubmitHandler,
  });

  return (
    <Form onSubmit={onSubmit}>
      <Controller
        name='title'
        control={control}
        rules={{ maxLength: 60 }}
        render={({ field, fieldState: { isTouched, error } }) => (
          <TextField
            {...field}
            size='md'
            label='Title'
            placeholder='Miscellaneous changes'
            isTouched={isTouched}
            error={error?.message}
          />
        )}
      />
      <CommitItemsListWrapper>
        {!Array.isArray(commitItems) || !commitItems.length ? (
          <Feedback type='empty' title='No Changes'>
            {`No changes were made to the route.`}
          </Feedback>
        ) : (
          <CommitItemsList items={commitItems} />
        )}
      </CommitItemsListWrapper>
      <Flex justifyContent='flex-end' width='full'>
        <Button
          variant='solid'
          colorScheme='orange'
          size='lg'
          type='submit'
          aria-label='Confirm edits'
          disabled={
            !Array.isArray(commitItems) ||
            !commitItems.length ||
            formState.isSubmitting
          }
        >
          <BiSave />
          <span>Save Changes</span>
        </Button>
      </Flex>
    </Form>
  );
};

const useCommitRouteForm = ({
  onSubmit: onSubmitHandler,
}: Pick<CommitRouteFormProps, 'onSubmit'>) => {
  const validationSchema = useMemo(
    () =>
      yup.object({
        title: yup.string().max(60, `Can't be longer than 60 characters`),
      }),
    []
  );

  const { control, formState, handleSubmit, reset } =
    useForm<CommitRouteFormValues>({
      defaultValues: {
        title: '',
      },
      resolver: yupResolver(validationSchema),
    });

  const onSubmit = useCallback(
    (values: CommitRouteFormValues) => {
      onSubmitHandler(values, { reset });
    },
    [reset, onSubmitHandler]
  );

  return {
    control,
    formState,
    onSubmit: handleSubmit(onSubmit),
  };
};

const Form = styled('form', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$4',
  width: '$full',
});

const CommitItemsListWrapper = styled('div', {
  overflowY: 'auto',
  maxHeight: '50vh',
  padding: '$2',
  borderWidth: '$2',
  borderStyle: 'solid',
  borderColor: '$slate-100',
  borderRadius: '$md',
});
