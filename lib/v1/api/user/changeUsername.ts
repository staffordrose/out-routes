import { User } from '@/types';
import { getJson, StatusError } from '@/utils';

const fallbackError = `Something went wrong updating your username`;

export const changeUsername = async (
  username: User['username']
): Promise<User> => {
  try {
    const res = await fetch(`/api/v1/user/username`, {
      method: 'PUT',
      body: JSON.stringify({ username }),
    });
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
