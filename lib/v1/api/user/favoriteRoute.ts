import { Route, User } from '@/types';
import { getJson, StatusError } from '@/utils';

const fallbackError = `Something went wrong favoriting the route`;

export const favoriteRoute = async (
  username: User['username'],
  slug: Route['slug']
): Promise<void> => {
  try {
    const res = await fetch(`/api/v1/user/favorites/${username}/${slug}`, {
      method: 'PUT',
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
