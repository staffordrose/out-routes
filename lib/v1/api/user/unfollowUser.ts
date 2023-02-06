import { User } from '@/types';
import { getJson, StatusError } from '@/utils';

const fallbackError = `Something went wrong unfollowing the user`;

export const unfollowUser = async (
  username: User['username']
): Promise<void> => {
  try {
    const res = await fetch(`/api/v1/user/following/${username}`, {
      method: 'DELETE',
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
