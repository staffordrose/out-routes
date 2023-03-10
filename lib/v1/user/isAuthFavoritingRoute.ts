import { Route } from '@/types/routes';
import { User } from '@/types/users';
import { StatusError } from '@/utils';
import { getXataClient } from '@/xata';

export const isAuthFavoritingRoute = async (
  authUserId: User['id'],
  username: User['username'],
  slug: Route['slug']
): Promise<boolean> => {
  try {
    // username is missing
    if (!username) {
      throw new StatusError(
        400,
        `A valid username is required to check if you've starred the route`
      );
    }

    // slug is missing
    if (!slug) {
      throw new StatusError(
        400,
        `A route slug is required to check if you've starred the route`
      );
    }

    const xata = getXataClient();

    const favorite = await xata.db.route_favorites
      .filter({
        'route.owner.username': username,
        'route.slug': slug,
        'user.id': authUserId,
      })
      .select(['id'])
      .getFirst();

    return !!favorite?.id;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new StatusError(
        400,
        `Something went wrong checking if you've starred ${
          username && slug ? `${username}/${slug}` : `a route`
        }`
      );
    }
  }
};
