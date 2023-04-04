import streamifier from 'streamifier';

import {
  Route,
  RouteStaticImageUrls,
  StaticImage,
  StaticImageNames,
} from '@/types/routes';
import { StatusError } from '@/utils';
import { getXataClient } from '@/xata';
import { cloudinary } from '../../server';
import { ROUTE_IMAGE_FOLDER } from '../uploads';

export const uploadRouteStaticImages = async (
  id: Route['id'],
  images: [
    StaticImage & { name: StaticImageNames.OG },
    StaticImage & { name: StaticImageNames.CARD_BANNER },
    StaticImage & { name: StaticImageNames.THUMB_360 },
    StaticImage & { name: StaticImageNames.THUMB_240 },
    StaticImage & { name: StaticImageNames.THUMB_120 }
  ]
): Promise<RouteStaticImageUrls> => {
  try {
    // route id is missing
    if (!id) {
      throw new StatusError(
        400,
        `The route id is required to upload route static images`
      );
    }

    const xata = getXataClient();

    const route = await xata.db.routes.filter({ id }).select(['id']).getFirst();

    // route does not exist
    if (!route) {
      throw new StatusError(404, `A route does not exist for the provided id`);
    }

    const streamPromises = images.map<Promise<string | null>>(
      ({ name, width, height, content }) => {
        return new Promise((resolve, reject) => {
          streamifier.createReadStream(content as Buffer).pipe(
            cloudinary.uploader.upload_stream(
              {
                folder: `${ROUTE_IMAGE_FOLDER}/${id}`,
                public_id: `static_${name}`,
                width,
                height,
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

    const [
      static_image_og,
      static_image_card_banner,
      static_image_thumb_360,
      static_image_thumb_240,
      static_image_thumb_120,
    ] = await Promise.all(streamPromises);

    return {
      static_image_og,
      static_image_card_banner,
      static_image_thumb_360,
      static_image_thumb_240,
      static_image_thumb_120,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new StatusError(
        400,
        `Something went wrong uploading the route static images`
      );
    }
  }
};
