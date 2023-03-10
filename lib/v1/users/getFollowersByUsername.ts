import safeJsonStringify from 'safe-json-stringify';

import { PaginatedFollowers } from '@/types/user-relationships';
import { User } from '@/types/users';
import { StatusError } from '@/utils';
import { getXataClient } from '@/xata';

export const getFollowersByUsername = async (
  username: User['username'],
  options?: {
    size: string | number;
    after?: string;
  }
): Promise<PaginatedFollowers> => {
  try {
    // username is missing
    if (!username) {
      throw new StatusError(
        400,
        `A valid username is required to get the user's followers`
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

    const followers = await xata.db.user_relationships
      .filter('followed', user.id)
      .select(['created_at', 'follower.*'])
      .sort('created_at', 'desc')
      .getPaginated({
        pagination: {
          size: Number(options?.size) || undefined,
          after: options?.after || undefined,
        },
      });

    return JSON.parse(safeJsonStringify(followers));
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new StatusError(
        400,
        `Something went wrong getting ${
          username ? `@${username}'s followers` : `the user's followers`
        }`
      );
    }
  }
};
