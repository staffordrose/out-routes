import safeJsonStringify from 'safe-json-stringify';

import { Commit, CommitWithItems } from '@/types';
import { StatusError } from '@/utils';
import { getXataClient } from '@/xata';

export const getRouteCommitById = async (
  id: Commit['id']
): Promise<CommitWithItems> => {
  try {
    // commit id is missing
    if (!id) {
      throw new StatusError(
        400,
        `A route history id is required to get the route history entry`
      );
    }

    const xata = getXataClient();

    const route_commit = await xata.db.route_commits
      .filter('id', id)
      .select(['*', 'route.*', 'user.*'])
      .getFirst();

    if (!route_commit) {
      throw new StatusError(
        404,
        `A route history entry does not exist for the provided id`
      );
    }

    const route_commit_items = await xata.db.route_commit_items
      .filter('commit.id', id)
      .select(['*'])
      .getAll();

    return JSON.parse(
      safeJsonStringify({
        commit: route_commit,
        items: route_commit_items,
      })
    );
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new StatusError(
        400,
        `Something went wrong getting the route history entry`
      );
    }
  }
};
