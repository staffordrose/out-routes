import { Session } from 'next-auth';
import safeJsonStringify from 'safe-json-stringify';

import { User } from '@/types/users';
import { StatusError } from '@/utils';
import { getXataClient } from '@/xata';

export const getUser = async (
  session: Session | null
): Promise<User | null> => {
  try {
    const xata = getXataClient();

    const authUser = await xata.db.users
      .filter('auth.email', session?.user?.email || '')
      .select(['*'])
      .getFirst();

    return authUser ? JSON.parse(safeJsonStringify(authUser)) : null;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new StatusError(400, `Something went wrong getting your profile`);
    }
  }
};
