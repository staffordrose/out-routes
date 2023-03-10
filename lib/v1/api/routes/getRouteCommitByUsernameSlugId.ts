import { Commit, CommitWithItems } from '@/types/commits';
import { Route } from '@/types/routes';
import { User } from '@/types/users';
import { getJson, StatusError } from '@/utils';

const fallbackError = `Something went wrong getting the route history entry`;

export const getRouteCommitByUsernameSlugId = async (
  username: User['username'],
  slug: Route['slug'],
  commitId: Commit['id']
): Promise<CommitWithItems> => {
  try {
    const res = await fetch(
      `/api/v1/routes/${username}/${slug}/commits/${commitId}`
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
