import { Route, RouteFeature } from '@/types';
import { StatusError } from '@/utils';
import { getXataClient } from '@/xata';

export const getRouteIdByFeatureId = async (
  id: RouteFeature['id']
): Promise<Route['id']> => {
  try {
    // id is missing
    if (!id) {
      throw new StatusError(
        400,
        `A route feature id is required to get the route id`
      );
    }

    const xata = getXataClient();

    const feature = await xata.db.route_features
      .filter({ id })
      .select(['route.id'])
      .getFirst();

    // feature does not exist
    if (!feature) {
      throw new StatusError(404, `The route feature does not exist`);
    }

    // feature is not linked to route
    if (!feature.route?.id) {
      throw new StatusError(400, `The route feature is not linked to a route`);
    }

    return feature.route.id;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new StatusError(400, `Something went wrong getting the route id`);
    }
  }
};
