import { Member } from '@/types/members';
import { Route } from '@/types/routes';
import { User } from '@/types/users';
import { StatusError } from '@/utils';
import { getXataClient } from '@/xata';

export const getAuthRouteMemberRoleByUsernameSlug = async (
  authUserId: User['id'],
  username: User['username'],
  slug: Route['slug']
): Promise<Member['role']> => {
  try {
    // username is missing
    if (!username) {
      throw new StatusError(
        400,
        `A valid username is required to get your route permission level`
      );
    }

    // slug is missing
    if (!slug) {
      throw new StatusError(
        400,
        `A route slug is required to get your route permission level`
      );
    }

    const xata = getXataClient();

    const member = await xata.db.route_members
      .filter({
        'route.owner.username': username,
        'route.slug': slug,
        'user.id': authUserId,
      })
      .select(['role'])
      .getFirst();

    if (!member) {
      throw new StatusError(403, `You are not a member of this route`);
    }

    return member.role;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new StatusError(
        400,
        `Something went wrong getting your route permission level`
      );
    }
  }
};
