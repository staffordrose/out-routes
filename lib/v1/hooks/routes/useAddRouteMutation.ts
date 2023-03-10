import { NextRouter } from 'next/router';
import { QueryClient, useMutation } from '@tanstack/react-query';

import { ToastContents } from '@/components/atoms';
import { RouteFormResult } from '@/features/routes/RouteForm/helpers';
import { Route, RouteFeature, RouteLayer } from '@/types/routes';
import { User } from '@/types/users';
import { addRoute, updateRoute } from '../../api/routes';
import { uploadRouteImage } from '../../api/uploads';

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
    mutationFn: async (values: RouteFormResult): Promise<Route> => {
      if (!authUser?.username) {
        throw new Error(`Your username is required to add the route`);
      }

      const { layers, features } = values;
      const { files, ...routeWithoutFiles } = values.route;

      const route = await addRoute(routeWithoutFiles);

      let routeImageIdUrls = {};

      if (Array.isArray(files) && files.length) {
        routeImageIdUrls = await uploadRouteImage(route.id, files[0]);

        if (route.image_full) {
          // release object URL that was created in RouteForm
          URL.revokeObjectURL(route.image_full);
        }
      }

      return updateRoute(authUser.username, route.slug, 'Route created', {
        route: {
          // properties from form values
          ...routeWithoutFiles,
          // properties from newly created route
          id: route.id,
          created_at: route.created_at,
          owner: route.owner,
          slug: route.slug,
          // properties from the uploaded route image
          ...routeImageIdUrls,
        },
        layers: (layers || []).map((layer) => ({
          ...layer,
          route: { id: route.id } as RouteLayer['route'],
        })),
        features: (features || []).map((feature) => ({
          ...feature,
          route: { id: route.id } as RouteFeature['route'],
        })),
      });
    },
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
