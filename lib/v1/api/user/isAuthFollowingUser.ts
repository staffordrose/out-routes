import { User } from '@/types';
import { getJson, StatusError } from '@/utils';

const fallbackError = `Something went wrong checking follow status`;

export const isAuthFollowingUser = async (
  username: User['username']
): Promise<boolean> => {
  try {
    const res = await fetch(`/api/v1/user/following/${username}`);
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
