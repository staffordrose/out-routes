import { Route, RouteImageIdUrls } from '@/types/routes';
import { getJson, StatusError } from '@/utils';

const fallbackError = `Something went wrong uploading the route image`;

export const uploadRouteImage = async (
  routeId: Route['id'],
  file: File
): Promise<RouteImageIdUrls> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`/api/v1/uploads/routes/${routeId}`, {
      method: 'POST',
      body: formData,
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
