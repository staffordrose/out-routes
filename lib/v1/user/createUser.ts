import { User } from '@/types';
import { sanitizeAndEscape, StatusError } from '@/utils';
import { getXataClient } from '@/xata';
import { uploadProfileImageUrl } from '../uploads';

export const createUser = async (
  id: User['id'],
  { name, image }: Pick<User, 'name'> & { image?: string }
): Promise<void> => {
  try {
    // id is missing
    if (!id) {
      throw new StatusError(
        400,
        `The user id is required to create a new user`
      );
    }

    const xata = getXataClient();

    let user;

    const sharedProperties = {
      created_at: new Date(),
      updated_at: new Date(),
      auth: id,
      name: sanitizeAndEscape(name || ''),
    };

    if (image) {
      const images = await uploadProfileImageUrl(id, image);

      user = await xata.db.users.create(id, {
        ...sharedProperties,
        ...images,
      });
    } else {
      user = await xata.db.users.create(id, sharedProperties);
    }

    if (!user) {
      throw new StatusError(400, `User could not be created`);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new StatusError(400, `Something went wrong creating user`);
    }
  }
};
