import { Session } from 'next-auth';
import { SelectableColumn } from '@xata.io/client';

import { User } from '@/types';
import { StatusError } from '@/utils';
import { getXataClient, UsersRecord } from '@/xata';

export const getUserPropertiesOrThrow = async (
  session: Session | null,
  properties: SelectableColumn<UsersRecord, []>[],
  errorMessage?: string
): Promise<Pick<User, 'id'> & Partial<User>> => {
  try {
    // auth user is not authenticated
    if (!session?.user?.email) {
      throw new StatusError(401, errorMessage || `You are not signed in`);
    }

    const xata = getXataClient();

    const authUser = await xata.db.users
      .filter('auth.email', session.user.email)
      .select(properties)
      .getFirst();

    // auth user does not exist
    if (!authUser) {
      throw new StatusError(403, `There is no record of your account`);
    }

    return authUser;
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
