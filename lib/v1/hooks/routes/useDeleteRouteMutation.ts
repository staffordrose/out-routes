import { NextRouter } from 'next/router';
import { QueryClient, useMutation } from '@tanstack/react-query';

import { ToastContents } from '@/components/atoms';
import { UsernameAndSlug } from '@/types/routes';
import { deleteRoute } from '../../api/routes';

export type UseDeleteRouteMutationProps = {
  router: NextRouter;
  queryClient: QueryClient;
  openToast: (contents: ToastContents) => void;
};

export const useDeleteRouteMutation = ({
  router,
  queryClient,
  openToast,
}: UseDeleteRouteMutationProps) => {
  const mutation = useMutation({
    mutationFn: ({ username, slug }: UsernameAndSlug) =>
      deleteRoute(username, slug),
    onError: (error) => {
      openToast({
        title: 'Oops!',
        description:
          error instanceof Error
            ? error.message
            : `Something went wrong attempting to delete the route`,
      });

      return error;
    },
    onSuccess: (_, { username, slug }) => {
      // cancel route contributor query
      queryClient.cancelQueries(['contributors', username, slug]);
      queryClient.removeQueries(['contributors', username, slug]);

      // cancel route query
      queryClient.cancelQueries(['routes', username, slug]);
      queryClient.removeQueries(['routes', username, slug]);

      // refetch auth user's routes
      queryClient.invalidateQueries(['routes', username]);

      router.push(`/routes`);
    },
  });

  return mutation;
};
