import type { NextApiHandler } from 'next/types';

import { getStaticMapImages } from '@/lib/v1/map';
import { allowApiMethods, catchApiResponse } from '@/utils';

type PostResponse = void;

const handler: NextApiHandler = async (req, res): Promise<PostResponse> => {
  allowApiMethods(req, res, ['POST']);

  switch (req.method) {
    case 'POST':
    default:
      return (await postHandler(req, res)) as PostResponse;
  }
};

export default handler;

// POST: static map image
const postHandler: NextApiHandler = async (req, res): Promise<PostResponse> => {
  const { boundingBox, features } = JSON.parse(req.body);

  try {
    const bufferImages = await getStaticMapImages(boundingBox, features);

    const base64Images = bufferImages.map(({ content, ...rest }) => {
      const imageBase64 = content.toString('base64');

      return {
        ...rest,
        type: 'image/png',
        content: imageBase64,
      };
    });

    const boundary = `images-${Math.random().toString().slice(2)}`;

    res.setHeader('Content-Type', `multipart/mixed; boundary=${boundary}`);

    for (const image of base64Images) {
      const { type, ...restImage } = image;

      res.write(`--${boundary}\r\n`);
      res.write(`Content-Type: ${type}\r\n`);
      res.write(`Content-Length: ${restImage.content.length}\r\n`);
      res.write('\r\n');
      res.write(JSON.stringify(restImage));
      res.write('\r\n');
    }

    res.write(`--${boundary}--\r\n`);

    res.end();
  } catch (error) {
    return catchApiResponse(
      res,
      error,
      `Something went wrong attempting to get the route static images`
    );
  }
};
