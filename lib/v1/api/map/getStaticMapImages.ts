import { LngLat, MapFeature } from '@/types/maps';
import { StatusError } from '@/utils';

type StaticImage = {
  contentType: string | null;
  name: string;
  width: number;
  height: number;
  blob: Blob;
};

const fallbackError = `Something went wrong attempting to get the static map images`;

export const getStaticMapImages = async (
  boundingBox: [LngLat, LngLat],
  features: MapFeature[]
): Promise<StaticImage[]> => {
  try {
    const res = await fetch(`/api/v1/map/static-map-images`, {
      method: 'POST',
      body: JSON.stringify({
        boundingBox,
        features,
      }),
    });

    if (!res.ok) {
      throw new StatusError(res.status, res.statusText || fallbackError);
    }

    const contentType = res.headers.get('content-type');

    if (!contentType?.startsWith('multipart/mixed')) {
      throw new StatusError(400, `Unexpected content type: ${contentType}`);
    }

    const boundary = getBoundaryFromContentType(contentType);

    const multipart = await res.text();

    const result = await parseMultipartResponse(multipart, boundary);

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new StatusError(400, fallbackError);
    }
  }
};

const getBoundaryFromContentType = (contentType: string): string => {
  const match = /boundary=(.+)$/.exec(contentType);

  if (!match) {
    throw new StatusError(400, `Invalid content type: ${contentType}`);
  }

  return match[1];
};

const parseMultipartResponse = async (
  multipart: string,
  boundary: string
): Promise<StaticImage[]> => {
  const parts = multipart.split(`--${boundary}`);

  const trimmedAndFilteredParts = parts
    .map((part: string) => part.trim())
    .filter((part: string) => part.length > 0 && !part.startsWith('--'));

  const promiseArray = trimmedAndFilteredParts.map(async (part: string) => {
    const matchContentType = /Content-Type:\s*(.+)$/im.exec(part);
    const contentType = matchContentType ? matchContentType[1] : null;

    const jsonObjMatch = part.match(/\{.*\}/s);
    const jsonObj: {
      name: string;
      width: number;
      height: number;
      content: string;
    } | null = jsonObjMatch?.[0] ? JSON.parse(jsonObjMatch[0]) : null;

    if (!jsonObj?.content) {
      throw new StatusError(
        400,
        `An image does not exist for the following size: ${
          jsonObj?.width && jsonObj.height
            ? `${jsonObj.width}x${jsonObj.height}`
            : 'unknown'
        }`
      );
    }

    const base64Image = `data:${contentType};base64,${jsonObj.content}`;
    const url = base64Image.replace(
      /^data:image\/[^;]+/,
      'data:application/octet-stream'
    );
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: 'image/png' });

    return {
      contentType,
      name: jsonObj.name || '',
      width: jsonObj?.width || 120,
      height: jsonObj?.height || 120,
      blob,
    };
  });

  return await Promise.all(promiseArray);
};
