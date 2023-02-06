import { ActivityActions } from '@/data/activity';
import { Favorite, Route, User } from '@/types';
import { StatusError } from '@/utils';
import { getXataClient } from '@/xata';
import { addActivityRecords } from '../activity';

export const favoriteRoute = async (
  authUser: Pick<User, 'id'> & Partial<User>,
  username: User['username'],
  slug: Route['slug']
): Promise<void> => {
  try {
    // username is missing
    if (!username) {
      throw new StatusError(
        400,
        `A valid username is required to star the route`
      );
    }

    // slug is missing
    if (!slug) {
      throw new StatusError(400, `A route slug is required to star the route`);
    }

    // cannot self-favorite
    if (!authUser.username || authUser.username === username) {
      throw new StatusError(400, `You cannot star your own routes`);
    }

    const xata = getXataClient();

    const route = await xata.db.routes
      .filter({ 'owner.username': username, slug })
      .select(['stats_favorites'])
      .getFirst();

    // route does not exist
    if (!route) {
      throw new StatusError(404, `The route you want to star does not exist`);
    }

    const existingFavorite = await xata.db.route_favorites
      .filter({ route: route.id, user: authUser.id })
      .select(['id'])
      .getFirst();

    // auth user is alreayd favoriting route
    if (existingFavorite) {
      throw new StatusError(400, `You already have this route starred`);
    }

    // create favorite
    const favorite = await xata.db.route_favorites.create({
      created_at: new Date(),
      route: route.id,
      user: authUser.id,
    });

    // favorite was not created
    if (!favorite?.id) {
      throw new StatusError(
        400,
        `An unknown error happened when attempting to star ${username}/${slug}`
      );
    }

    await Promise.all([
      // update auth user stats
      xata.db.users.update(authUser.id, {
        stats_favorites: (Number(authUser.stats_favorites) || 0) + 1,
      }),
      // update route stats
      xata.db.routes.update(route.id, {
        stats_favorites: (Number(route.stats_favorites) || 0) + 1,
      }),
    ]);

    const favoriteWithRouteUser = await xata.db.route_favorites
      .filter('id', favorite.id)
      .select(['*', 'route.*', 'route.owner.username', 'user.*'])
      .getFirst();

    // create activity records
    addActivityRecords(authUser.id, {
      action: ActivityActions.FAVORITE_ROUTE,
      payload: favoriteWithRouteUser as Favorite,
    });
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new StatusError(
        400,
        `Something went wrong attempting to star ${
          username && slug ? `${username}/${slug}` : `a route`
        }`
      );
    }
  }
};
