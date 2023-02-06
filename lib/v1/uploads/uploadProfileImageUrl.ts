import { User } from '@/types';
import { isValidUrl, StatusError } from '@/utils';
import { cloudinary } from '../../server';
import { PROFILE_IMAGE_FOLDER, PROFILE_IMAGE_SIZES } from '../uploads';

export const uploadProfileImageUrl = async (
  id: User['id'],
  url: string
): Promise<
  Pick<
    User,
    | 'image_full'
    | 'image_thumb_360'
    | 'image_thumb_240'
    | 'image_thumb_120'
    | 'image_thumb_64'
    | 'image_thumb_32'
    | 'image_thumb_16'
  >
> => {
  try {
    if (!isValidUrl(url || '')) {
      throw new StatusError(400, `Not a valid URL`);
    }

    const uploadPromises = PROFILE_IMAGE_SIZES.map<Promise<string | null>>(
      async ({ name, width, height, crop }) => {
        const image = await cloudinary.uploader.upload(url, {
          folder: `${PROFILE_IMAGE_FOLDER}/${id}`,
          public_id: name,
          width,
          height,
          crop,
        });
        return image?.secure_url || null;
      }
    );

    const [
      full,
      thumb_360,
      thumb_240,
      thumb_120,
      thumb_64,
      thumb_32,
      thumb_16,
    ] = await Promise.all(uploadPromises);

    return {
      image_full: full,
      image_thumb_360: thumb_360,
      image_thumb_240: thumb_240,
      image_thumb_120: thumb_120,
      image_thumb_64: thumb_64,
      image_thumb_32: thumb_32,
      image_thumb_16: thumb_16,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new StatusError(400, `Something went wrong uploading the image`);
    }
  }
};
