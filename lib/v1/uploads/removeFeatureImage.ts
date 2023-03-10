import { RouteFeature } from '@/types/routes';
import { StatusError } from '@/utils';
import { getXataClient } from '@/xata';
import { FEATURE_IMAGE_SIZES } from '../uploads';

export const removeFeatureImage = async (
  id: RouteFeature['id'],
  imageId: RouteFeature['image_id']
): Promise<void> => {
  try {
    // feature id is missing
    if (!id) {
      throw new StatusError(
        400,
        `The route feature id is required to remove the image`
      );
    }

    // route imageId is missing
    if (!imageId) {
      throw new StatusError(
        400,
        `The route feature image id is required to remove the image`
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
        `The route feature does not have an image to remove`
      );
    }

    // update feature image properties
    await xata.db.route_features.update(id, {
      image_id: null,
      ...FEATURE_IMAGE_SIZES.reduce(
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
