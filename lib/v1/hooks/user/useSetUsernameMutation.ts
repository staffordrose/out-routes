import { NextRouter } from 'next/router';
import { QueryClient, useMutation } from '@tanstack/react-query';
import queryString from 'query-string';

import { ToastContents } from '@/components/atoms';
import { User } from '@/types/users';
import { getRelativePath } from 'utils';
import { changeUsername } from '../../api/user';

export type UseSetUsernameMutationProps = {
  router: NextRouter;
  queryClient: QueryClient;
  hasName?: boolean;
  callbackUrl?: string;
  openToast: (toastContents: ToastContents) => void;
};

export const useSetUsernameMutation = ({
  router,
  queryClient,
  hasName,
  callbackUrl,
  openToast,
}: UseSetUsernameMutationProps) => {
  const mutation = useMutation({
    mutationFn: ({ username }: Pick<User, 'username'>) =>
      changeUsername(username),
    onError: (error) => {
      openToast({
        title: 'Oops!',
        description:
          error instanceof Error
            ? error.message
            : `Something went wrong attempting to set your username`,
      });

      return error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['user']);

      router.push(
        hasName
          ? getRelativePath(callbackUrl)
          : callbackUrl
          ? `/account/new/name?${queryString.stringify({
              callbackUrl,
            })}`
          : `/account/new/name`
      );
    },
  });

  return mutation;
};
