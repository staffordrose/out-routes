import safeJsonStringify from 'safe-json-stringify';

import { PaginatedFollowing } from '@/types/user-relationships';
import { User } from '@/types/users';
import { StatusError } from '@/utils';
import { getXataClient } from '@/xata';

export const getFollowingByUsername = async (
  username: User['username'],
  options?: {
    size: string | number;
    after?: string;
  }
): Promise<PaginatedFollowing> => {
  try {
    // username is missing
    if (!username) {
      throw new StatusError(
        400,
        `A valid username is required to get the user's following`
      );
    }

    const xata = getXataClient();

    const user = await xata.db.users
      .filter({ username })
      .select(['id'])
      .getFirst();

    // user does not exist
    if (!user) {
      throw new StatusError(
        404,
        `A user does not exist for the provided username`
      );
    }

    const following = await xata.db.user_relationships
      .filter('follower', user.id)
      .select(['created_at', 'followed.*'])
      .sort('created_at', 'desc')
      .getPaginated({
        pagination: {
          size: Number(options?.size) || undefined,
          after: options?.after || undefined,
        },
      });

    return JSON.parse(safeJsonStringify(following));
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new StatusError(
        400,
        `Something went wrong getting ${
          username ? `@${username}'s following` : `the user's following`
        }`
      );
    }
  }
};
