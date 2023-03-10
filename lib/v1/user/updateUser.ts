import safeJsonStringify from 'safe-json-stringify';

import { User } from '@/types/users';
import { sanitizeAndEscape, StatusError } from '@/utils';
import { getXataClient } from '@/xata';

export const updateUser = async (
  authUserId: User['id'],
  values: Partial<User>
): Promise<User> => {
  try {
    const { name, bio, company, location } = values;

    const xata = getXataClient();

    const updatedUser = await xata.db.users.update(authUserId, {
      updated_at: new Date(),
      name: sanitizeAndEscape(name || ''),
      bio: sanitizeAndEscape(bio || ''),
      company: sanitizeAndEscape(company || ''),
      location: sanitizeAndEscape(location || ''),
    });

    if (!updatedUser) {
      throw new StatusError(
        400,
        `The update to your profile failed for an unknown reason`
      );
    }

    return JSON.parse(safeJsonStringify(updatedUser));
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new StatusError(400, `Something went wrong updating your profile`);
    }
  }
};
