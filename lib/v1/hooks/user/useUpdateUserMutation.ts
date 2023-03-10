import { NextRouter } from 'next/router';
import { QueryClient, useMutation } from '@tanstack/react-query';

import { ToastContents } from '@/components/atoms';
import { User } from '@/types/users';
import { updateUser } from '../../api/user';

export type UseUpdateUserMutationProps = {
  router: NextRouter;
  queryClient: QueryClient;
  openToast: (toastContents: ToastContents) => void;
};

export const useUpdateUserMutation = ({
  router,
  queryClient,
  openToast,
}: UseUpdateUserMutationProps) => {
  const mutation = useMutation({
    mutationFn: (values: Partial<User>) => updateUser(values),
    onError: (error) => {
      openToast({
        title: 'Oops!',
        description:
          error instanceof Error
            ? error.message
            : `Something went wrong attempting to update your profile`,
      });

      return error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['user']);

      router.push('/account');
    },
  });

  return mutation;
};
