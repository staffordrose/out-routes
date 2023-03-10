import { Session } from 'next-auth';

import { User } from '@/types/users';
import { StatusError } from '@/utils';
import { getXataClient } from '@/xata';

export const getUserId = async (
  session: Session | null
): Promise<User['id'] | null> => {
  try {
    const xata = getXataClient();

    const authUser = await xata.db.users
      .filter('auth.email', session?.user?.email || '')
      .select(['id'])
      .getFirst();

    return authUser?.id || null;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new StatusError(
        400,
        `Something went wrong checking your authenticated status`
      );
    }
  }
};
