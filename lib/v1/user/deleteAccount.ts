import { User } from '@/types';
import { StatusError } from '@/utils';

export const deleteAccount = async (authUserId: User['id']): Promise<void> => {
  try {
    // TODO: Remove
    console.log('authUserId', authUserId);

    // TODO: Create transaction that removes all user-related table rows
    throw new StatusError(501, `This functionality has not been implemented`);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new StatusError(400, `Something went wrong deleting your account`);
    }
  }
};
