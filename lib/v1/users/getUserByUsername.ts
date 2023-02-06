import safeJsonStringify from 'safe-json-stringify';

import { User } from '@/types';
import { StatusError } from '@/utils';
import { getXataClient } from '@/xata';

export const getUserByUsername = async (
  username: User['username']
): Promise<User> => {
  try {
    // username is missing
    if (!username) {
      throw new StatusError(
        400,
        `A valid username is required to get the user`
      );
    }

    const xata = getXataClient();

    const user = await xata.db.users
      .filter({ username })
      .select(['*'])
      .getFirst();

    // user does not exist
    if (!user) {
      throw new StatusError(
        400,
        `A user does not exist for the provided username`
      );
    }

    return JSON.parse(safeJsonStringify(user));
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new StatusError(
        400,
        `Something went wrong getting ${username ? `@${username}` : `the user`}`
      );
    }
  }
};
