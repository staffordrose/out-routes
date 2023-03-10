import { Commit } from '@/types/commits';
import { PartialRouteLayersFeatures, Route } from '@/types/routes';
import { User } from '@/types/users';
import { getJson, StatusError } from '@/utils';

const fallbackError = `Something went wrong updating the route`;

export const updateRoute = async (
  username: User['username'],
  slug: Route['slug'],
  commitTitle: Commit['title'],
  values: PartialRouteLayersFeatures
): Promise<Route> => {
  try {
    const res = await fetch(`/api/v1/routes/${username}/${slug}`, {
      method: 'PUT',
      body: JSON.stringify({ commitTitle, values }),
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
