import { Route, User } from '@/types';
import { getJson, StatusError } from '@/utils';

const fallbackError = `Something went wrong changing the route slug`;

export const changeRouteSlug = async (
  username: User['username'],
  oldSlug: Route['slug'],
  nextSlug: string
): Promise<Route> => {
  try {
    const res = await fetch(`/api/v1/routes/${username}/${oldSlug}/slug`, {
      method: 'PUT',
      body: JSON.stringify({ slug: nextSlug }),
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
