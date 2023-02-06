import safeJsonStringify from 'safe-json-stringify';

import { PaginatedMembers, Route, User } from '@/types';
import { StatusError } from '@/utils';
import { getXataClient } from '@/xata';

export const getRouteMembersByUsernameSlug = async (
  username: User['username'],
  slug: Route['slug'],
  options?: { size: string | number; after?: string }
): Promise<PaginatedMembers> => {
  try {
    // username is missing
    if (!username) {
      throw new StatusError(
        400,
        `A valid username is required to get the route members`
      );
    }

    // slug is missing
    if (!slug) {
      throw new StatusError(
        400,
        `A route slug is required to get the route members`
      );
    }

    const xata = getXataClient();

    const members = await xata.db.route_members
      .filter({ 'route.owner.username': username, 'route.slug': slug })
      .select(['created_at', 'user.*'])
      .getPaginated({
        pagination: {
          size: Number(options?.size) || undefined,
          after: options?.after || undefined,
        },
      });

    return JSON.parse(safeJsonStringify(members));
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new StatusError(400, `Something went wrong getting route members`);
    }
  }
};
