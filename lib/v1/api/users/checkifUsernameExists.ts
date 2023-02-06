import { User } from '@/types';
import { StatusError } from '@/utils';

const fallbackError = `Something went wrong checking if username exists`;

export const checkIfUsernameExists = async (
  username: User['username']
): Promise<void> => {
  try {
    const res = await fetch(`/api/v1/users/${username}`);

    if (res.ok) {
      throw new StatusError(400, `Username exists`);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new StatusError(400, fallbackError);
    }
  }
};
