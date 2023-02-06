import { Session } from 'next-auth';
import safeJsonStringify from 'safe-json-stringify';

import { databaseSchema } from '@/data/db';
import { RouteSearchRecord, SearchRecord, User } from '@/types';
import { StatusError } from '@/utils';
import { getXataClient } from '@/xata';
import { getUserId } from '../user';

export const searchRoutesAndUsers = async (
  session: Session | null,
  q: string
): Promise<SearchRecord[]> => {
  try {
    // search query is missing
    if (!q) {
      throw new StatusError(400, `A search query is required`);
    }

    const xata = getXataClient();

    let authUserId: User['id'] | null = null;

    if (session) {
      authUserId = await getUserId(session);
    }

    const searchResults = await xata.search.all(q, {
      fuzziness: 2, // 2 is max allowed by xata
      tables: [
        {
          table: 'users',
          target: [
            { column: 'username', weight: 5 },
            { column: 'name', weight: 5 },
          ],
        },
        {
          table: 'routes',
          filter: {
            is_private: false,
          },
          target: [
            { column: 'slug', weight: 5 },
            { column: 'title', weight: 5 },
            { column: 'title_alt', weight: 5 },
            { column: 'activity_type', weight: 2 },
            { column: 'region', weight: 4 },
            { column: 'country', weight: 3 },
          ],
        },
      ],
    });

    const promiseArray = searchResults
      // prevent auth user record from being returned
      .filter(({ table, record }) =>
        table === databaseSchema.users ? record.id !== authUserId : true
      )
      .map(async (result) => {
        const { table, record } = result;

        // only modify route records
        if (![databaseSchema.routes].includes(table)) {
          return result;
        }

        // add owner to route records
        const routeWithOwner = await xata.db.routes
          .filter('id', record.id)
          .select(['*', 'owner.*'])
          .getFirst();

        return { table, record: routeWithOwner } as RouteSearchRecord;
      });

    const results = await Promise.all(promiseArray);

    return JSON.parse(safeJsonStringify(results));
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new StatusError(400, `Something went wrong with your search`);
    }
  }
};
