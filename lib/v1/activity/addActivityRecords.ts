import safeJsonStringify from 'safe-json-stringify';
import isEmpty from 'lodash.isempty';

import { ActivityActions, activityActionTables } from '@/data/activity';
import { Favorite, Route, User, UserRelationship } from '@/types';
import { StatusError } from '@/utils';
import { getXataClient } from '@/xata';

export const addActivityRecords = async (
  creatorId: User['id'],
  {
    action,
    payload,
  }: {
    action: ActivityActions;
    payload: Favorite | Route | UserRelationship;
  }
): Promise<void> => {
  try {
    if (!creatorId) {
      throw new StatusError(
        400,
        `A creator id is required to add activity records`
      );
    }
    if (!action) {
      throw new StatusError(
        400,
        `An action type is required to add activity records`
      );
    }
    if (!payload || isEmpty(payload)) {
      throw new StatusError(
        400,
        `An action payload is required to add activity records`
      );
    }

    const xata = getXataClient();

    // get all users who follow the activity creator
    let followers = await xata.db.user_relationships
      .filter('followed', creatorId)
      .select(['follower.*'])
      .getAll();

    if (action === ActivityActions.FOLLOW_USER) {
      // filter out the user being followed
      followers = followers.filter(
        ({ follower }) =>
          follower?.id !== (payload as UserRelationship).followed?.id
      );
    }

    // create activity records
    const promiseArray = followers
      .filter(({ follower }) => follower?.id)
      .map(({ follower }) => {
        return xata.db.activity.create({
          created_at: new Date(),
          user: follower?.id,
          creator: creatorId,
          resource_id: payload.id,
          resource_table: activityActionTables[action],
          action,
          payload: safeJsonStringify(payload),
        });
      });

    await Promise.all(promiseArray);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new StatusError(
        400,
        `Something went wrong attempting to create activity records`
      );
    }
  }
};
