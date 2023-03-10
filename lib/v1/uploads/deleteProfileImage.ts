import { User } from '@/types/users';
import { StatusError } from '@/utils';
import { getXataClient } from '@/xata';
import { cloudinary } from '../../server';
import { PROFILE_IMAGE_FOLDER, PROFILE_IMAGE_SIZES } from '../uploads';

export const deleteProfileImage = async (
  authUser: Pick<User, 'id'> & Partial<User>
): Promise<void> => {
  try {
    const xata = getXataClient();

    // destroy directory and enclosed images
    const destroyPromises = PROFILE_IMAGE_SIZES.map(({ name }) =>
      cloudinary.uploader.destroy(
        `${PROFILE_IMAGE_FOLDER}/${authUser.id}/${name}`
      )
    );

    await Promise.all(destroyPromises);

    // update user image properties
    await xata.db.users.update(
      authUser.id,
      PROFILE_IMAGE_SIZES.reduce(
        (accum, { name }) => ({ ...accum, [`image_${name}`]: null }),
        {} as Record<string, null>
      )
    );
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
