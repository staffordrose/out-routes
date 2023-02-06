import { Session } from 'next-auth';

import { User } from '@/types';
import { StatusError } from '@/utils';
import { getXataClient } from '@/xata';

export const getUserIdOrThrow = async (
  session: Session | null,
  errorMessage?: string
): Promise<User['id']> => {
  try {
    // auth user is not authenticated
    if (!session?.user?.email) {
      throw new StatusError(401, errorMessage || `You are not signed in`);
    }

    const xata = getXataClient();

    const authUser = await xata.db.users
      .filter('auth.email', session.user.email)
      .select(['id'])
      .getFirst();

    // auth user does not exist
    if (!authUser) {
      throw new StatusError(403, `There is no record of your account`);
    }

    return authUser.id;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new StatusError(
        400,
        errorMessage ||
          `Something went wrong checking your authenticated status`
      );
    }
  }
};
