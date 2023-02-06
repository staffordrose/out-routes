import { NextRouter } from 'next/router';
import { QueryClient, useMutation } from '@tanstack/react-query';

import { ToastContents } from '@/components/atoms';
import { User } from '@/types';
import { changeUsername } from '../../api/user';

export type UseChangeUsernameMutationProps = {
  router: NextRouter;
  queryClient: QueryClient;
  openToast: (toastContents: ToastContents) => void;
};

export const useChangeUsernameMutation = ({
  router,
  queryClient,
  openToast,
}: UseChangeUsernameMutationProps) => {
  const mutation = useMutation({
    mutationFn: ({ username }: Pick<User, 'username'>) =>
      changeUsername(username),
    onError: (error) => {
      openToast({
        title: 'Oops!',
        description:
          error instanceof Error
            ? error.message
            : `Something went wrong attempting to update your username`,
      });

      return error;
    },
    onSuccess: ({ username }) => {
      queryClient.invalidateQueries(['user']);

      router.push(`/${username}`);
    },
  });

  return mutation;
};
