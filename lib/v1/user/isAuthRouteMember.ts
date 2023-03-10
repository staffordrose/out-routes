import { Route } from '@/types/routes';
import { User } from '@/types/users';
import { StatusError } from '@/utils';
import { getXataClient } from '@/xata';

export const isAuthRouteMember = async (
  authUserId: User['id'],
  username: User['username'],
  slug: Route['slug']
): Promise<boolean> => {
  try {
    // username is missing
    if (!username) {
      throw new StatusError(
        400,
        `A valid username is required to check if you are a route member`
      );
    }

    // slug is missing
    if (!slug) {
      throw new StatusError(
        400,
        `A route slug is required to check if you are a route member`
      );
    }

    const xata = getXataClient();

    const member = await xata.db.route_members
      .filter({
        'route.owner.username': username,
        'route.slug': slug,
        'user.id': authUserId,
      })
      .select(['id'])
      .getFirst();

    return !!member?.id;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error(
        `Something went wrong checking wrong if you are a route member`
      );
    }
  }
};
