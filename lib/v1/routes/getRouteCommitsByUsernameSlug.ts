import safeJsonStringify from 'safe-json-stringify';

import { PaginatedCommits, Route, User } from '@/types';
import { StatusError } from '@/utils';
import { getXataClient } from '@/xata';

export const getRouteCommitsByUsernameSlug = async (
  username: User['username'],
  slug: Route['slug'],
  options?: { size: string | number; after?: string }
): Promise<PaginatedCommits> => {
  try {
    // username is missing
    if (!username) {
      throw new StatusError(
        400,
        `A valid username is required to get the route history`
      );
    }

    // slug is missing
    if (!slug) {
      throw new StatusError(
        400,
        `A route slug is required to get the route history`
      );
    }

    const xata = getXataClient();

    const commits = await xata.db.route_commits
      .filter({ 'user.username': username, 'route.slug': slug })
      .select(['*', 'route.*', 'user.*'])
      .sort('created_at', 'desc')
      .getPaginated({
        pagination: {
          size: Number(options?.size) || undefined,
          after: options?.after || undefined,
        },
      });

    return JSON.parse(safeJsonStringify(commits));
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new StatusError(
        400,
        `Something went wrong getting ${
          username && slug ? `${username}/${slug} history` : `the route history`
        }`
      );
    }
  }
};
