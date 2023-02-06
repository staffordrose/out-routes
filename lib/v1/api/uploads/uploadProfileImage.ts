import { getJson, StatusError } from '@/utils';

const fallbackError = `Something went wrong uploading the image`;

export const uploadProfileImage = async (file: File): Promise<void> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`/api/v1/uploads/user`, {
      method: 'POST',
      body: formData,
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
