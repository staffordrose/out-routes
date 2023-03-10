import safeJsonStringify from 'safe-json-stringify';

import { PaginatedContributors } from '@/types/contributors';
import { Route } from '@/types/routes';
import { User } from '@/types/users';
import { StatusError } from '@/utils';
import { getXataClient } from '@/xata';

export const getRouteContributorsByUsernameSlug = async (
  username: User['username'],
  slug: Route['slug'],
  options?: { size: string | number; after?: string }
): Promise<PaginatedContributors> => {
  try {
    // username is missing
    if (!username) {
      throw new StatusError(
        400,
        `A valid username is required to get the route contributors`
      );
    }

    // slug is missing
    if (!slug) {
      throw new StatusError(
        400,
        `A route slug is required to get the route contributors`
      );
    }

    const xata = getXataClient();

    const contributors = await xata.db.route_contributors
      .filter({ 'user.username': username, 'route.slug': slug })
      .select(['created_at', 'user.*'])
      .getPaginated({
        pagination: {
          size: Number(options?.size) || undefined,
          after: options?.after || undefined,
        },
      });

    return JSON.parse(safeJsonStringify(contributors));
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new StatusError(
        400,
        `Something went wrong getting ${
          username && slug
            ? `${username}/${slug} contributors`
            : `the route contributors`
        }`
      );
    }
  }
};
