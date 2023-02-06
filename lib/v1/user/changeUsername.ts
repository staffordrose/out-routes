import dayjs from 'dayjs';

import { User } from '@/types';
import { sanitizeAndEscape, StatusError } from '@/utils';
import { getXataClient } from '@/xata';

export const changeUsername = async (
  authUser: Pick<User, 'id'> & Partial<User>,
  username: User['username']
): Promise<User['username']> => {
  try {
    // check if username was changed in previous 365 days
    if (authUser.username_updated_at) {
      const today = dayjs();
      const comparisonDate = dayjs(authUser.username_updated_at).add(1, 'year');

      // if less than 365 days since last username change, prevent update
      if (today.isBefore(comparisonDate)) {
        throw new StatusError(
          400,
          `Your username can only be changed every 12 months`
        );
      }
    }

    const xata = getXataClient();

    /**
     * TODO: Add additional checks to username
     * 1. no spaces
     * 2. not blacklisted
     * 3. doesn't match existing (only checking client-side right now!!!)
     */
    const updatedUser = await xata.db.users.update(authUser.id, {
      updated_at: new Date(),
      username: sanitizeAndEscape(username || ''),
      username_updated_at: new Date(),
    });

    return updatedUser?.username || null;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new StatusError(
        400,
        `Something went wrong attempting to change your username`
      );
    }
  }
};
