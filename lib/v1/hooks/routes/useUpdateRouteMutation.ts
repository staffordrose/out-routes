import { NextRouter } from 'next/router';
import { QueryClient, useMutation } from '@tanstack/react-query';

import { ToastContents } from '@/components/atoms';
import { PartialRouteLayersFeatures, Route, User } from '@/types';
import { updateRoute } from '../../api/routes';

export type UseUpdateRouteMutationProps = {
  router: NextRouter;
  queryClient: QueryClient;
  username: User['username'];
  slug: Route['slug'];
  openToast: (toastContents: ToastContents) => void;
};

export const useUpdateRouteMutation = ({
  router,
  queryClient,
  username,
  slug,
  openToast,
}: UseUpdateRouteMutationProps) => {
  const mutation = useMutation({
    mutationFn: ({
      commitTitle,
      values,
    }: {
      commitTitle: string;
      values: PartialRouteLayersFeatures;
    }) => updateRoute(username, slug, commitTitle, values),
    onError: (error) => {
      openToast({
        title: 'Oops!',
        description:
          error instanceof Error
            ? error.message
            : `Something went wrong attempting to update the route`,
      });

      return error;
    },
    onSuccess: () => {
      // refetch route contributors list
      queryClient.invalidateQueries(['contributors', username, slug]);
      // refetch route properties
      queryClient.invalidateQueries(['routes', username, slug]);
      // refetch owner's routes list
      queryClient.invalidateQueries(['routes', username]);

      router.push(`/${username}/${slug}`);
    },
  });

  return mutation;
};
