import { Commit, PartialRouteLayersFeatures, Route, User } from '@/types';
import { getJson, StatusError } from '@/utils';

const fallbackError = `Something went wrong updating the route`;

export const updateRoute = async (
  username: User['username'],
  slug: Route['slug'],
  commitTitle: Commit['title'],
  values: PartialRouteLayersFeatures
): Promise<void> => {
  try {
    const res = await fetch(`/api/v1/routes/${username}/${slug}`, {
      method: 'PUT',
      body: JSON.stringify({ commitTitle, values }),
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
