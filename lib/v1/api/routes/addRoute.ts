import { Route } from '@/types/routes';
import { getJson, StatusError } from '@/utils';

const fallbackError = `Something went wrong when adding the route`;

export const addRoute = async (
  values: Pick<Route, 'title'> & Partial<Route>
): Promise<Route> => {
  try {
    const res = await fetch(`/api/v1/routes`, {
      method: 'POST',
      body: JSON.stringify(values),
    });
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
