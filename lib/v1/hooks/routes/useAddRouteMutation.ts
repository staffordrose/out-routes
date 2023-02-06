import { NextRouter } from 'next/router';
import { QueryClient, useMutation } from '@tanstack/react-query';

import { ToastContents } from '@/components/atoms';
import { Route, User } from '@/types';
import { addRoute } from '../../api/routes';

export type UseAddRouteMutationProps = {
  router: NextRouter;
  queryClient: QueryClient;
  authUser?: User;
  openToast: (toastContents: ToastContents) => void;
};

export const useAddRouteMutation = ({
  router,
  queryClient,
  authUser,
  openToast,
}: UseAddRouteMutationProps) => {
  const mutation = useMutation({
    mutationFn: (values: Pick<Route, 'title'> & Partial<Route>) =>
      addRoute(values),
    onError: (error) => {
      openToast({
        title: 'Oops!',
        description:
          error instanceof Error
            ? error.message
            : `Something went wrong attempting to add the route`,
      });

      return error;
    },
    onSuccess: ({ slug }) => {
      if (authUser?.username) {
        // refetch auth user's routes
        queryClient.invalidateQueries(['routes', authUser.username]);

        router.push(`/${authUser.username}/${slug}`);
      }
    },
  });

  return mutation;
};
