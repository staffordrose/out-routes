import { Route } from '@/types/routes';
import { getJson, StatusError } from '@/utils';

const fallbackError = `Something went wrong attempting to delete the route static images`;

export const deleteRouteStaticImages = async (
  routeId: Route['id']
): Promise<void> => {
  try {
    const res = await fetch(`/api/v1/uploads/routes/${routeId}/static-images`, {
      method: 'DELETE',
    });
    const data = await getJson(res);

    if (!res.ok) {
      throw new StatusError(res.status, data?.message || fallbackError);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new StatusError(400, fallbackError);
    }
  }
};
