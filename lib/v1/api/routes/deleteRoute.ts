import { Route, User } from '@/types';
import { getJson, StatusError } from '@/utils';

const fallbackError = `Something went wrong deleting the route`;

export const deleteRoute = async (
  username: User['username'],
  slug: Route['slug']
): Promise<void> => {
  try {
    const res = await fetch(`/api/v1/routes/${username}/${slug}`, {
      method: 'DELETE',
    });
    const data = await getJson(res);

    if (!res.ok) {
      throw new StatusError(res.status, data?.message || fallbackError);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new StatusError(400, fallbackError);
    }
  }
};
