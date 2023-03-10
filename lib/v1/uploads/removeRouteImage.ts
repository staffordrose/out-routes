import { Route } from '@/types/routes';
import { StatusError } from '@/utils';
import { getXataClient } from '@/xata';
import { ROUTE_IMAGE_SIZES } from '../uploads';

export const removeRouteImage = async (
  id: Route['id'],
  imageId: Route['image_id']
): Promise<void> => {
  try {
    // route id is missing
    if (!id) {
      throw new StatusError(
        400,
        `The route id is required to remove the image`
      );
    }

    // route imageId is missing
    if (!imageId) {
      throw new StatusError(
        400,
        `The route image id is required to remove the image`
      );
    }

    const xata = getXataClient();

    const route = await xata.db.routes
      .filter({ id })
      .select(['image_id'])
      .getFirst();

    // route does not exist
    if (!route) {
      throw new StatusError(404, `A route does not exist for the provided id`);
    }

    // route image is missing
    if (!route.image_id) {
      throw new StatusError(400, `The route does not have an image to remove`);
    }

    // update route image properties
    await xata.db.routes.update(id, {
      image_id: null,
      ...ROUTE_IMAGE_SIZES.reduce(
        (accum, { name }) => ({ ...accum, [`image_${name}`]: null }),
        {} as Record<string, null>
      ),
    });
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new StatusError(
        400,
        `Something went wrong attempting to remove the image`
      );
    }
  }
};
