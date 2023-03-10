import safeJsonStringify from 'safe-json-stringify';

import { Route, RouteLayersFeatures } from '@/types/routes';
import { User } from '@/types/users';
import { StatusError } from '@/utils';
import { getXataClient } from '@/xata';

export const getRouteByUsernameSlug = async (
  username: User['username'],
  slug: Route['slug']
): Promise<RouteLayersFeatures> => {
  try {
    // username is missing
    if (!username) {
      throw new StatusError(400, `A valid username is required to get a route`);
    }

    // slug is missing
    if (!slug) {
      throw new StatusError(400, `A route slug is required to get a route`);
    }

    const xata = getXataClient();

    const [routeResult, layersResult, featuresResult] =
      await Promise.allSettled([
        // route
        xata.db.routes
          .filter({ 'owner.username': username, slug })
          .select(['*', 'owner.*'])
          .getFirst(),
        // route_layers
        xata.db.route_layers
          .filter({ 'route.owner.username': username, 'route.slug': slug })
          .select(['*'])
          .sort('order', 'asc')
          .getAll(),
        // route_features
        xata.db.route_features
          .filter({ 'route.owner.username': username, 'route.slug': slug })
          .select(['*'])
          .sort('order', 'asc')
          .getAll(),
      ]);

    // route does not exist
    if (routeResult.status !== 'fulfilled' || !routeResult.value) {
      throw new StatusError(
        404,
        `A route does not exist for the provided username and slug`
      );
    }

    return JSON.parse(
      safeJsonStringify({
        route: routeResult.value,
        layers: layersResult.status === 'fulfilled' ? layersResult.value : [],
        features:
          featuresResult.status === 'fulfilled' ? featuresResult.value : [],
      })
    );
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new StatusError(400, `Something went wrong getting the route`);
    }
  }
};
