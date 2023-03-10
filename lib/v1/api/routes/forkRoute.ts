import { Route } from '@/types/routes';
import { User } from '@/types/users';
import { getJson, StatusError } from '@/utils';

const fallbackError = `Something went wrong forking the route`;

export const forkRoute = async (
  username: User['username'],
  slug: Route['slug']
): Promise<void> => {
  try {
    const res = await fetch(`/api/v1/routes/${username}/${slug}/forks`, {
      method: 'POST',
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
