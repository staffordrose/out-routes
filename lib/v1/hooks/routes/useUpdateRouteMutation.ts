import { NextRouter } from 'next/router';
import { QueryClient, useMutation } from '@tanstack/react-query';

import { ToastContents } from '@/components/atoms';
import { RouteFormResult } from '@/features/routes/RouteForm/helpers';
import { Route, User } from '@/types';
import { updateRoute } from '../../api/routes';
import { uploadRouteImage } from '../../api/uploads';

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
    mutationFn: async ({
      commitTitle,
      values,
    }: {
      commitTitle: string;
      values: RouteFormResult;
    }) => {
      const { route, layers, features } = values;
      const { files, ...routeWithoutFiles } = route;

      let routeImageIdUrls;

      if (Array.isArray(files) && files.length) {
        routeImageIdUrls = await uploadRouteImage(route.id, files[0]);

        if (route.image_full) {
          // release object URL that was created in RouteForm
          URL.revokeObjectURL(route.image_full);
        }

        return updateRoute(username, slug, commitTitle, {
          route: {
            ...routeWithoutFiles,
            ...routeImageIdUrls,
          },
          layers,
          features,
        });
      } else {
        return updateRoute(username, slug, commitTitle, {
          route: routeWithoutFiles,
          layers,
          features,
        });
      }
    },
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
