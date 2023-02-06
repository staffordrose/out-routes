import { Route, RouteLayersFeatures, User } from '@/types';
import { getJson, StatusError } from '@/utils';

const fallbackError = `Something went wrong getting the route`;

export const getRouteByUsernameSlug = async (
  username: User['username'],
  slug: Route['slug']
): Promise<RouteLayersFeatures> => {
  try {
    const res = await fetch(`/api/v1/routes/${username}/${slug}`);
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
