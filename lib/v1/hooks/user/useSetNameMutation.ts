import { NextRouter } from 'next/router';
import { QueryClient, useMutation } from '@tanstack/react-query';

import { ToastContents } from '@/components/atoms';
import { User } from '@/types';
import { getRelativePath } from 'utils';
import { updateUser } from '../../api/user';

export type UseSetNameMutationProps = {
  router: NextRouter;
  queryClient: QueryClient;
  callbackUrl?: string;
  openToast: (toastContents: ToastContents) => void;
};

export const useSetNameMutation = ({
  router,
  queryClient,
  callbackUrl,
  openToast,
}: UseSetNameMutationProps) => {
  const mutation = useMutation({
    mutationFn: ({ name }: Pick<User, 'name'>) => updateUser({ name }),
    onError: (error) => {
      openToast({
        title: 'Oops!',
        description:
          error instanceof Error
            ? error.message
            : `Something went wrong attempting to set your name`,
      });

      return error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['user']);
      router.push(getRelativePath(callbackUrl));
    },
  });

  return mutation;
};
