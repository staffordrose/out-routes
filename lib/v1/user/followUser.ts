import { ActivityActions } from '@/data/activity';
import { UserRelationship } from '@/types/user-relationships';
import { User } from '@/types/users';
import { StatusError } from '@/utils';
import { getXataClient } from '@/xata';
import { addActivityRecords } from './addActivityRecords';

export const followUser = async (
  authUser: Pick<User, 'id'> & Partial<User>,
  username: User['username']
): Promise<void> => {
  try {
    // username is missing
    if (!username) {
      throw new StatusError(
        400,
        `A valid username is required to follow a user`
      );
    }

    // cannot self-follow
    if (!authUser.username || authUser.username === username) {
      throw new StatusError(400, `You cannot follow yourself`);
    }

    const xata = getXataClient();

    const followed = await xata.db.users
      .filter({ username })
      .select(['stats_followers'])
      .getFirst();

    // followed user does not exist
    if (!followed) {
      throw new StatusError(404, `The user you want to follow does not exist`);
    }

    const existingRelationship = await xata.db.user_relationships
      .filter({ follower: authUser.id, followed: followed.id })
      .select(['id'])
      .getFirst();

    // auth user is already following user
    if (existingRelationship) {
      throw new StatusError(400, `You are already following this user`);
    }

    // create user_relationship
    const relationship = await xata.db.user_relationships.create({
      created_at: new Date(),
      follower: authUser.id,
      followed: followed.id,
    });

    // relationship was not created
    if (!relationship?.id) {
      throw new StatusError(
        400,
        `An unknown error happened when attempting to follow @${username}`
      );
    }

    await Promise.all([
      // create or update auth user stats
      xata.db.users.update(authUser.id, {
        stats_following: (Number(authUser.stats_following) || 0) + 1,
      }),
      // create or update followed user stats
      xata.db.users.update(followed.id, {
        stats_followers: (Number(followed.stats_followers) || 0) + 1,
      }),
    ]);

    const relationshipWithFollowed = await xata.db.user_relationships
      .filter('id', relationship.id)
      .select(['*', 'followed.*'])
      .getFirst();

    // create activity records
    addActivityRecords(authUser.id, {
      action: ActivityActions.FOLLOW_USER,
      payload: relationshipWithFollowed as UserRelationship,
    });
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new StatusError(
        400,
        `Something went wrong attempting to follow ${
          username ? `@${username}` : `a user`
        }`
      );
    }
  }
};
