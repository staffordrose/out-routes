import { MapFeature } from '@/types/maps';
import { getJson, StatusError } from '@/utils';

const fallbackError = `Something went wrong attempting to get the feature elevations`;

export const getFeatureElevations = async (
  geometry: MapFeature['geometry']
): Promise<number[]> => {
  try {
    const res = await fetch(`/api/v1/map/feature-elevations`, {
      method: 'POST',
      body: JSON.stringify(geometry),
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
