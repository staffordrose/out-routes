import { Activity } from '@/types/activity';
import { User } from '@/types/users';
import { StatusError } from '@/utils';
import { getXataClient } from '@/xata';

export const deleteActivityRecords = async (
  creatorId: User['id'],
  {
    action,
    resource_id,
    resource_table,
  }: {
    action: Activity['action'];
    resource_id: Activity['resource_id'];
    resource_table: Activity['resource_table'];
  }
): Promise<void> => {
  try {
    if (!creatorId) {
      throw new StatusError(
        400,
        `A creator id is required to delete activity records`
      );
    }
    if (!action) {
      throw new StatusError(
        400,
        `An action type is required to delete activity records`
      );
    }
    if (!resource_id) {
      throw new StatusError(
        400,
        `The resource id is required to delete activity records`
      );
    }
    if (!resource_table) {
      throw new StatusError(
        400,
        `The resource table name is required to delete activity records`
      );
    }

    const xata = getXataClient();

    // get all activity records for the action
    const activityRecords = await xata.db.activity
      .filter({
        creator: creatorId,
        action: action,
        resource_id: resource_id,
        resource_table: resource_table,
      })
      .select(['id'])
      .getAll();

    // delete activity records
    const promiseArray = activityRecords.map((activity) => {
      return xata.db.activity.delete(activity.id);
    });

    await Promise.all(promiseArray);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new StatusError(
        400,
        `Something went wrong attempting to delete activity records`
      );
    }
  }
};
