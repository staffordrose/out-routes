import { Member, Route, User } from '@/types';
import { StatusError } from '@/utils';
import { getXataClient } from '@/xata';

export const getAuthRouteMemberRoleById = async (
  authUserId: User['id'],
  id: Route['id']
): Promise<Member['role']> => {
  try {
    // id is missing
    if (!id) {
      throw new StatusError(
        400,
        `A route id is required to get your route permission level`
      );
    }

    const xata = getXataClient();

    const member = await xata.db.route_members
      .filter({
        'route.id': id,
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
