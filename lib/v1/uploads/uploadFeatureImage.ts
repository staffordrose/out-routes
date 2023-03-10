import streamifier from 'streamifier';

import { RouteFeature, RouteFeatureImageIdUrls } from '@/types/routes';
import { createAlphaNumericId, StatusError } from '@/utils';
import { getXataClient } from '@/xata';
import { cloudinary } from '../../server';

export const FEATURE_IMAGE_FOLDER = 'features';
export const FEATURE_IMAGE_SIZES: Array<{
  name: string;
  width?: number;
  height?: number;
  crop?: 'fill';
}> = [
  { name: 'full' },
  { name: 'large', width: 1920, height: 1440, crop: 'fill' },
  { name: 'card_banner', width: 320, height: 180, crop: 'fill' },
  { name: 'thumb_360', width: 360, height: 360, crop: 'fill' },
  { name: 'thumb_240', width: 240, height: 240, crop: 'fill' },
  { name: 'thumb_120', width: 120, height: 120, crop: 'fill' },
];

export const uploadFeatureImage = async (
  id: RouteFeature['id'],
  buffer: Buffer
): Promise<RouteFeatureImageIdUrls> => {
  try {
    // feature id is missing
    if (!id) {
      throw new StatusError(
        400,
        `The route feature id is required to upload an image`
      );
    }

    const xata = getXataClient();

    const feature = await xata.db.route_features
      .filter({ id })
      .select(['id'])
      .getFirst();

    // feature does not exist
    if (!feature) {
      throw new StatusError(
        404,
        `A route feature does not exist for the provided id`
      );
    }

    const imageId = createAlphaNumericId();

    const streamPromises = FEATURE_IMAGE_SIZES.map<Promise<string | null>>(
      ({ name, width, height, crop }) => {
        return new Promise((resolve, reject) => {
          streamifier.createReadStream(buffer).pipe(
            cloudinary.uploader.upload_stream(
              {
                folder: `${FEATURE_IMAGE_FOLDER}/${id}`,
                public_id: `${imageId}_${name}`,
                width,
                height,
                crop,
              },
              (err, image) => {
                if (err) reject(err);
                resolve(image?.secure_url || null);
              }
            )
          );
        });
      }
    );

    const [full, large, card_banner, thumb_360, thumb_240, thumb_120] =
      await Promise.all(streamPromises);

    return {
      image_id: imageId,
      image_full: full,
      image_large: large,
      image_card_banner: card_banner,
      image_thumb_360: thumb_360,
      image_thumb_240: thumb_240,
      image_thumb_120: thumb_120,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new StatusError(400, `Something went wrong uploading the image`);
    }
  }
};
