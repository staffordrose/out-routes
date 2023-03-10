import { RouteFeature, RouteFeatureImageIdUrls } from '@/types/routes';
import { getJson, StatusError } from '@/utils';

const fallbackError = `Something went wrong uploading the route feature image`;

export const uploadFeatureImage = async (
  featureId: RouteFeature['id'],
  file: File
): Promise<RouteFeatureImageIdUrls> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`/api/v1/uploads/features/${featureId}`, {
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
