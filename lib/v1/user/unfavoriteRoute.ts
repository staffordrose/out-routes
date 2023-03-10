import { ActivityActions } from '@/data/activity';
import { databaseSchema } from '@/data/db';
import { Route } from '@/types/routes';
import { User } from '@/types/users';
import { StatusError } from '@/utils';
import { getXataClient } from '@/xata';
import { deleteActivityRecords } from './deleteActivityRecords';

export const unfavoriteRoute = async (
  authUser: Pick<User, 'id'> & Partial<User>,
  username: User['username'],
  slug: Route['slug']
): Promise<void> => {
  try {
    // username is missing
    if (!username) {
      throw new StatusError(
        400,
        `A valid username is required to unstar the route`
      );
    }

    // slug is missing
    if (!slug) {
      throw new StatusError(
        400,
        `A route slug is required to unstar the route`
      );
    }

    // cannot self-unfavorite
    if (!authUser.username || authUser.username === username) {
      throw new StatusError(400, `You cannot unstar your own routes`);
    }

    const xata = getXataClient();

    const route = await xata.db.routes
      .filter({ 'owner.username': username, slug })
      .select(['stats_favorites'])
      .getFirst();

    // route does not exist
    if (!route) {
      throw new StatusError(404, `The route you want to unstar does not exist`);
    }

    const favorite = await xata.db.route_favorites
      .filter({ 'route.id': route.id, 'user.id': authUser.id })
      .select(['id'])
      .getFirst();

    // favorite does not exist
    if (!favorite?.id) {
      throw new StatusError(400, `You have not starred this route`);
    }

    const userFavoritesCount = Number(authUser.stats_favorites) || 0;
    const routeFavoritesCount = Number(route.stats_favorites) || 0;

    await Promise.all([
      // delete the favorite
      favorite.delete(),
      // update auth user stats
      xata.db.users.update(authUser.id, {
        stats_favorites: Math.max(userFavoritesCount - 1, 0),
      }),
      // update route stats
      xata.db.routes.update(route.id, {
        stats_favorites: Math.max(routeFavoritesCount - 1, 0),
      }),
    ]);

    // delete activity records
    deleteActivityRecords(authUser.id, {
      action: ActivityActions.FAVORITE_ROUTE,
      resource_id: favorite.id,
      resource_table: databaseSchema.route_favorites,
    });
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new StatusError(
        400,
        `Something went wrong attempting to unstar ${
          username && slug ? `${username}/${slug}` : `a route`
        }`
      );
    }
  }
};
