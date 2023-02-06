import { Route } from '@/types';
import { createAlphaNumericId, StatusError } from '@/utils';
import { getXataClient } from '@/xata';
import { cloudinary } from '../../server';
import { ROUTE_IMAGE_FOLDER, ROUTE_IMAGE_SIZES } from '../uploads';

export const cloneRouteImage = async (
  baseId: Route['id'],
  forkId: Route['id']
): Promise<void> => {
  try {
    const xata = getXataClient();

    const base = await xata.db.routes
      .filter('id', baseId)
      .select(['*'])
      .getFirst();

    if (!base) {
      throw new StatusError(
        404,
        `The route you want to clone images from does not exist`
      );
    }

    if (
      !base.image_id ||
      !base.image_full ||
      !base.image_og ||
      !base.image_banner ||
      !base.image_card_banner ||
      !base.image_thumb_360 ||
      !base.image_thumb_240 ||
      !base.image_thumb_120
    ) {
      throw new StatusError(
        400,
        `The route you want to clone images from doesn't have an image set`
      );
    }

    const fork = await xata.db.routes
      .filter('id', forkId)
      .select(['id'])
      .getFirst();

    if (!fork) {
      throw new StatusError(
        404,
        `The forked route you want to clone images to does not exist`
      );
    }

    const imageId = createAlphaNumericId();

    const uploadPromises = ROUTE_IMAGE_SIZES.map<Promise<string | null>>(
      async ({ name, width, height, crop }) => {
        const key = `image_${name}` as keyof Route;
        const url = base[key];

        const image = await cloudinary.uploader.upload(url as string, {
          folder: `${ROUTE_IMAGE_FOLDER}/${forkId}`,
          public_id: `${imageId}_${name}`,
          width,
          height,
          crop,
        });
        return image?.secure_url || null;
      }
    );

    const [full, og, banner, card_banner, thumb_360, thumb_240, thumb_120] =
      await Promise.all(uploadPromises);

    await fork.update({
      image_id: imageId,
      image_full: full,
      image_og: og,
      image_banner: banner,
      image_card_banner: card_banner,
      image_thumb_360: thumb_360,
      image_thumb_240: thumb_240,
      image_thumb_120: thumb_120,
    });
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new StatusError(400, `Something went wrong uploading the image`);
    }
  }
};
