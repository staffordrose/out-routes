import safeJsonStringify from 'safe-json-stringify';

import { User } from '@/types/users';
import { StatusError } from '@/utils';
import { getXataClient } from '@/xata';

export const getFollowingIds = async (
  authUserId: User['id']
): Promise<User['id'][]> => {
  try {
    const xata = getXataClient();

    const relationships = await xata.db.user_relationships
      .filter('follower.id', authUserId)
      .select(['followed.id'])
      .getAll();

    return JSON.parse(
      safeJsonStringify(
        relationships.map(({ followed }) => followed?.id).filter((id) => id)
      )
    );
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new StatusError(
        400,
        `Something went wrong getting the users you follow`
      );
    }
  }
};
