import { User } from '@/types/users';
import { StatusError } from '@/utils';
import { getXataClient } from '@/xata';

export const isAuthFollowingUser = async (
  authUserId: User['id'],
  username: User['username']
): Promise<boolean> => {
  try {
    // username is missing
    if (!username) {
      throw new StatusError(
        400,
        `A valid username is required to check if you are following the user`
      );
    }

    const xata = getXataClient();

    const relationship = await xata.db.user_relationships
      .filter({
        'follower.id': authUserId,
        'followed.username': username,
      })
      .select(['id'])
      .getFirst();

    return !!relationship?.id;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new StatusError(
        400,
        `Something went wrong checking if you are following ${
          username ? `@${username}` : `a user`
        }`
      );
    }
  }
};
