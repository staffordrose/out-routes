import queryString from 'query-string';

import { PaginatedMembers } from '@/types/members';
import { Route } from '@/types/routes';
import { User } from '@/types/users';
import { getJson, StatusError } from '@/utils';

const fallbackError = `Something went wrong getting the route members`;

export const getRouteMembersByUsernameSlug = async (
  username: User['username'],
  slug: Route['slug'],
  options?: { size: string | number; after?: string }
): Promise<PaginatedMembers> => {
  try {
    const res = await fetch(
      `/api/v1/routes/${username}/${slug}/members?${queryString.stringify({
        size: options?.size,
        after: options?.after,
      })}`
    );
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
