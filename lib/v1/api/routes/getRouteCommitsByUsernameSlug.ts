import queryString from 'query-string';
import { PaginatedCommits, Route, User } from '@/types';
import { getJson, StatusError } from '@/utils';

const fallbackError = `Something went wrong getting the route history`;

export const getRouteCommitsByUsernameSlug = async (
  username: User['username'],
  slug: Route['slug'],
  options?: { size: string | number; after?: string }
): Promise<PaginatedCommits> => {
  try {
    const res = await fetch(
      `/api/v1/routes/${username}/${slug}/commits?${queryString.stringify({
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
