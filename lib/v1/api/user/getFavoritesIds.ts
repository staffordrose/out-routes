import { Route } from '@/types';
import { getJson, StatusError } from '@/utils';

const fallbackError = `Something went wrong getting your starred routes`;

export const getFavoritesIds = async (): Promise<Route['id'][]> => {
  try {
    const res = await fetch(`/api/v1/user/favorites`);
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
