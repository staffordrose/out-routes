import streamifier from 'streamifier';
import { User } from '@/types/users';
import { StatusError } from '@/utils';
import { getXataClient } from '@/xata';
import { cloudinary } from '../../server';

export const PROFILE_IMAGE_FOLDER = 'profiles';
export const PROFILE_IMAGE_SIZES: Array<{
  name: string;
  width?: number;
  height?: number;
  crop?: 'fill';
}> = [
  { name: 'full' },
  { name: 'thumb_360', width: 360, height: 360, crop: 'fill' },
  { name: 'thumb_240', width: 240, height: 240, crop: 'fill' },
  { name: 'thumb_120', width: 120, height: 120, crop: 'fill' },
  { name: 'thumb_64', width: 64, height: 64, crop: 'fill' },
  { name: 'thumb_32', width: 32, height: 32, crop: 'fill' },
  { name: 'thumb_16', width: 16, height: 16, crop: 'fill' },
];

export const uploadProfileImage = async (
  authUserId: User['id'],
  buffer: Buffer
): Promise<void> => {
  try {
    const streamPromises = PROFILE_IMAGE_SIZES.map<Promise<string | null>>(
      ({ name, width, height, crop }) => {
        return new Promise((resolve, reject) => {
          streamifier.createReadStream(buffer).pipe(
            cloudinary.uploader.upload_stream(
              {
                folder: `${PROFILE_IMAGE_FOLDER}/${authUserId}`,
                public_id: name,
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

    const [
      full,
      thumb_360,
      thumb_240,
      thumb_120,
      thumb_64,
      thumb_32,
      thumb_16,
    ] = await Promise.all(streamPromises);

    const xata = getXataClient();

    // update user with new image urls
    await xata.db.users.update(authUserId, {
      image_full: full,
      image_thumb_360: thumb_360,
      image_thumb_240: thumb_240,
      image_thumb_120: thumb_120,
      image_thumb_64: thumb_64,
      image_thumb_32: thumb_32,
      image_thumb_16: thumb_16,
    });
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new StatusError(400, `Something went wrong uploading the image`);
    }
  }
};
