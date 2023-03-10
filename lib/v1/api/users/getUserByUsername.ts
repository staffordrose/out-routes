import { User } from '@/types/users';
import { getJson, StatusError } from '@/utils';

const fallbackError = `Something went wrong getting the user`;

export const getUserByUsername = async (
  username: User['username']
): Promise<User> => {
  try {
    const res = await fetch(`/api/v1/users/${username}`);
    const data = await getJson(res);

    if (!res.ok) {
      throw new StatusError(res.status, data?.message || fallbackError);
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new StatusError(400, fallbackError);
    }
  }
};
