import { Route } from '@/types';
import { StatusError } from '@/utils';
import { getXataClient } from '@/xata';
import { cloudinary } from '../../server';
import { ROUTE_IMAGE_FOLDER, ROUTE_IMAGE_SIZES } from '../uploads';

export const deleteRouteImages = async (
  id: Route['id'],
  imageIds: Route['image_id'][]
): Promise<void> => {
  try {
    // route id is missing
    if (!id) {
      throw new StatusError(
        400,
        `The route id is required to delete the image`
      );
    }

    // route imageIds are missing
    if (!Array.isArray(imageIds) || !imageIds.length) {
      throw new StatusError(
        400,
        `The route image id(s) are required to delete the image`
      );
    }

    const xata = getXataClient();

    const route = await xata.db.routes.filter({ id }).select(['id']).getFirst();

    // route does not exist
    if (!route) {
      throw new StatusError(404, `A route does not exist for the provided id`);
    }

    // destroy images
    const destroyPromises = imageIds.reduce((accum, imageId) => {
      ROUTE_IMAGE_SIZES.forEach(({ name }) => {
        accum.push(
          cloudinary.uploader.destroy(
            `${ROUTE_IMAGE_FOLDER}/${id}/${imageId}_${name}`
          )
        );
      });
      return accum;
    }, [] as Promise<void>[]);

    await Promise.all(destroyPromises);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new StatusError(
        400,
        `Something went wrong attempting to delete the route images`
      );
    }
  }
};
