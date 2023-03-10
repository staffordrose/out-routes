import queryString from 'query-string';

import { SearchRecord } from '@/types/search';
import { getJson, StatusError } from '@/utils';

const fallbackError = `Something went wrong with your search`;

export const searchRoutesAndUsers = async (
  q: string
): Promise<SearchRecord[]> => {
  try {
    const res = await fetch(`/api/v1/search?${queryString.stringify({ q })}`);
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
