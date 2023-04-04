import { Route, StaticImageNames } from '@/types/routes';
import { StatusError } from '@/utils';
import { getXataClient } from '@/xata';
import { cloudinary } from '../../server';
import { ROUTE_IMAGE_FOLDER } from '../uploads';

export const deleteRouteStaticImages = async (
  id: Route['id']
): Promise<void> => {
  try {
    // route id is missing
    if (!id) {
      throw new StatusError(
        400,
        `The route id is required to delete the static images`
      );
    }

    const xata = getXataClient();

    const route = await xata.db.routes
      .filter({ id })
      .select(['id', 'static_image_og'])
      .getFirst();

    // route does not exist
    if (!route) {
      throw new StatusError(404, `A route does not exist for the provided id`);
    }

    // no images to delete
    if (!route.static_image_og) {
      return;
    }

    // destroy images
    const destroyPromises = [
      { name: StaticImageNames.OG },
      { name: StaticImageNames.CARD_BANNER },
      { name: StaticImageNames.THUMB_360 },
      { name: StaticImageNames.THUMB_240 },
      { name: StaticImageNames.THUMB_120 },
    ].map(({ name }) =>
      cloudinary.uploader.destroy(`${ROUTE_IMAGE_FOLDER}/${id}/static_${name}`)
    );

    await Promise.all(destroyPromises);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new StatusError(
        400,
        `Something went wrong attempting to delete the route static images`
      );
    }
  }
};
