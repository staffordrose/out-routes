import { User } from '@/types';
import { getJson, StatusError } from '@/utils';

const fallbackError = `Something went wrong updating your profile`;

export const updateUser = async (user: Partial<User>): Promise<User> => {
  try {
    const res = await fetch(`/api/v1/user/profile`, {
      method: 'PUT',
      body: JSON.stringify(user),
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
