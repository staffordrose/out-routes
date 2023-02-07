import { ActivityActions } from '@/data/activity';
import { databaseSchema } from '@/data/db';
import { User } from '@/types';
import { StatusError } from '@/utils';
import { getXataClient } from '@/xata';
import { deleteActivityRecords } from './deleteActivityRecords';

export const unfollowUser = async (
  authUser: Pick<User, 'id'> & Partial<User>,
  username: User['username']
): Promise<void> => {
  try {
    // username is missing
    if (!username) {
      throw new StatusError(
        400,
        `A valid username is required to unfollow the user`
      );
    }

    // cannot self-unfollow
    if (!authUser.username || authUser.username === username) {
      throw new StatusError(400, `You cannot unfollow yourself`);
    }

    const xata = getXataClient();

    const followed = await xata.db.users
      .filter({ username })
      .select(['stats_followers'])
      .getFirst();

    // followed user does not exist
    if (!followed) {
      throw new StatusError(
        404,
        `The user you want to unfollow does not exist`
      );
    }

    const relationship = await xata.db.user_relationships
      .filter({ 'follower.id': authUser.id, 'followed.username': username })
      .select(['id'])
      .getFirst();

    // relationship does not exist
    if (!relationship?.id) {
      throw new StatusError(400, `You are not following this user`);
    }

    const followingCount = Number(authUser.stats_following) || 0;
    const followersCount = Number(followed.stats_followers) || 0;

    await Promise.all([
      // delete the relationship
      relationship.delete(),
      // update auth user stats
      xata.db.users.update(authUser.id, {
        stats_following: Math.max(followingCount - 1, 0),
      }),
      // update unfollowed user stats
      xata.db.users.update(followed.id, {
        stats_followers: Math.max(followersCount - 1, 0),
      }),
    ]);

    // delete activity records
    deleteActivityRecords(authUser.id, {
      action: ActivityActions.FOLLOW_USER,
      resource_id: relationship.id,
      resource_table: databaseSchema.user_relationships,
    });
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new StatusError(
        400,
        `Something went wrong attempting to unfollow ${
          username ? `@${username}` : `a user`
        }`
      );
    }
  }
};
