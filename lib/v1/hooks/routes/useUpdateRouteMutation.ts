import { NextRouter } from 'next/router';
import { QueryClient, useMutation } from '@tanstack/react-query';

import { ToastContents } from '@/components/atoms';
import { RouteFormResult } from '@/features/routes/RouteForm/helpers';
import { LngLat, MapFeature } from '@/types/maps';
import { Route } from '@/types/routes';
import { User } from '@/types/users';
import {
  mapLayerAndFeatureRecordsToMapboxLayer,
  parseMapBounds,
} from '@/utils';
import { getStaticMapImages } from '../../api/map';
import { updateRoute } from '../../api/routes';
import { uploadRouteImage, uploadRouteStaticImages } from '../../api/uploads';
import { deleteRouteStaticImages } from '../../api/uploads';

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

      let routeStaticImageUrls: Pick<
        Route,
        | 'static_image_og'
        | 'static_image_card_banner'
        | 'static_image_thumb_360'
        | 'static_image_thumb_240'
        | 'static_image_thumb_120'
      > = {
        static_image_og: null,
        static_image_card_banner: null,
        static_image_thumb_360: null,
        static_image_thumb_240: null,
        static_image_thumb_120: null,
      };

      if (
        Array.isArray(features) &&
        features.length &&
        routeWithoutFiles.map_bounding_box
      ) {
        try {
          const mapBounds = parseMapBounds(routeWithoutFiles.map_bounding_box);
          const mapBoundsArr = mapBounds?.toArray() as [LngLat, LngLat];

          const mapFeatures = (layers || []).reduce((accum, layer) => {
            const mapLayer = mapLayerAndFeatureRecordsToMapboxLayer(
              layer,
              features.filter((feature) => feature.layer?.id === layer.id)
            );

            if (Array.isArray(mapLayer.data.features)) {
              accum = accum.concat(mapLayer.data.features);
            }

            return accum;
          }, [] as MapFeature[]);

          const staticMapImages = await getStaticMapImages(
            mapBoundsArr,
            mapFeatures
          );

          routeStaticImageUrls = await uploadRouteStaticImages(
            route.id,
            staticMapImages
          );
        } catch (error) {
          if (error instanceof Error) {
            console.error(error);
          }
        }
      } else {
        try {
          await deleteRouteStaticImages(route.id);
        } catch (error) {
          if (error instanceof Error) {
            console.error(error);
          }
        }
      }

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
            ...routeStaticImageUrls,
          },
          layers,
          features,
        });
      } else {
        return updateRoute(username, slug, commitTitle, {
          route: {
            ...routeWithoutFiles,
            ...routeStaticImageUrls,
          },
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
