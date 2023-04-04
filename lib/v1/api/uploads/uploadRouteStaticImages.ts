import { Route, RouteStaticImageUrls, StaticImage } from '@/types/routes';
import { getJson, StatusError } from '@/utils';

const fallbackError = `Something went wrong uploading the route static images`;

export const uploadRouteStaticImages = async (
  routeId: Route['id'],
  images: StaticImage[]
): Promise<RouteStaticImageUrls> => {
  try {
    const formData = new FormData();

    images.forEach(({ name, content }) => {
      formData.append(name, content as File);
    });

    const res = await fetch(`/api/v1/uploads/routes/${routeId}/static-images`, {
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
