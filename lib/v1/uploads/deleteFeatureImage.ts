import { RouteFeature } from '@/types/routes';
import { StatusError } from '@/utils';
import { getXataClient } from '@/xata';
import { cloudinary } from '../../server';
import { FEATURE_IMAGE_FOLDER, FEATURE_IMAGE_SIZES } from '../uploads';

export const deleteFeatureImage = async (
  id: RouteFeature['id'],
  imageId: RouteFeature['image_id']
): Promise<void> => {
  try {
    // feature id is missing
    if (!id) {
      throw new StatusError(
        400,
        `The route feature id is required to delete the image`
      );
    }

    // route imageId is missing
    if (!imageId) {
      throw new StatusError(
        400,
        `The route feature image id is required to delete the image`
      );
    }

    const xata = getXataClient();

    const feature = await xata.db.route_features
      .filter({ id })
      .select(['image_id'])
      .getFirst();

    // feature does not exist
    if (!feature) {
      throw new StatusError(
        404,
        `A route feature does not exist for the provided id`
      );
    }

    // feature image is missing
    if (!feature.image_id) {
      throw new StatusError(
        400,
        `The route feature does not have an image to delete`
      );
    }

    // destroy directory and enclosed images
    const destroyPromises = FEATURE_IMAGE_SIZES.map(({ name }) =>
      cloudinary.uploader.destroy(
        `${FEATURE_IMAGE_FOLDER}/${id}/${imageId}_${name}`
      )
    );

    await Promise.all(destroyPromises);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new StatusError(
        400,
        `Something went wrong attempting to delete the image`
      );
    }
  }
};
