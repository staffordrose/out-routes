import streamifier from 'streamifier';

import { Route, RouteImageIdUrls } from '@/types/routes';
import { createAlphaNumericId, StatusError } from '@/utils';
import { getXataClient } from '@/xata';
import { cloudinary } from '../../server';

export const ROUTE_IMAGE_FOLDER = 'routes';
export const ROUTE_IMAGE_SIZES: Array<{
  name: string;
  width?: number;
  height?: number;
  crop?: 'fill';
}> = [
  { name: 'full' },
  { name: 'og', width: 1200, height: 630, crop: 'fill' },
  { name: 'banner', width: 1280, height: 720, crop: 'fill' },
  { name: 'card_banner', width: 320, height: 180, crop: 'fill' },
  { name: 'thumb_360', width: 360, height: 360, crop: 'fill' },
  { name: 'thumb_240', width: 240, height: 240, crop: 'fill' },
  { name: 'thumb_120', width: 120, height: 120, crop: 'fill' },
];

export const uploadRouteImage = async (
  id: Route['id'],
  buffer: Buffer
): Promise<RouteImageIdUrls> => {
  try {
    // route id is missing
    if (!id) {
      throw new StatusError(400, `The route id is required to upload an image`);
    }

    const xata = getXataClient();

    const route = await xata.db.routes.filter({ id }).select(['id']).getFirst();

    // route does not exist
    if (!route) {
      throw new StatusError(404, `A route does not exist for the provided id`);
    }

    const imageId = createAlphaNumericId();

    const streamPromises = ROUTE_IMAGE_SIZES.map<Promise<string | null>>(
      ({ name, width, height, crop }) => {
        return new Promise((resolve, reject) => {
          streamifier.createReadStream(buffer).pipe(
            cloudinary.uploader.upload_stream(
              {
                folder: `${ROUTE_IMAGE_FOLDER}/${id}`,
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

    const [full, og, banner, card_banner, thumb_360, thumb_240, thumb_120] =
      await Promise.all(streamPromises);

    return {
      image_id: imageId,
      image_full: full,
      image_og: og,
      image_banner: banner,
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
