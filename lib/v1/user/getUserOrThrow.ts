import { Session } from 'next-auth';
import safeJsonStringify from 'safe-json-stringify';

import { User } from '@/types/users';
import { StatusError } from '@/utils';
import { getXataClient } from '@/xata';

export const getUserOrThrow = async (
  session: Session | null
): Promise<User> => {
  try {
    // auth user is not authenticated
    if (!session?.user?.email) {
      throw new StatusError(401, `You must be signed in to get your profile`);
    }

    const xata = getXataClient();

    const authUser = await xata.db.users
      .filter('auth.email', session.user.email)
      .select(['*'])
      .getFirst();

    // auth user does not exist
    if (!authUser) {
      throw new StatusError(403, `There is no record of your account`);
    }

    return JSON.parse(safeJsonStringify(authUser));
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new StatusError(400, `Something went wrong getting your profile`);
    }
  }
};
