import type { NextApiHandler, NextApiResponse } from 'next/types';

import { getFeatureElevations } from '@/lib/v1/map';
import { allowApiMethods, catchApiResponse } from '@/utils';

type PostResponse = NextApiResponse<number[]> | void;

const handler: NextApiHandler = async (req, res): Promise<PostResponse> => {
  allowApiMethods(req, res, ['POST']);

  switch (req.method) {
    case 'POST':
    default:
      return (await postHandler(req, res)) as PostResponse;
  }
};

export default handler;

// POST: feature elevations
const postHandler: NextApiHandler = async (req, res): Promise<PostResponse> => {
  const reqBody = JSON.parse(req.body);

  try {
    const elevations = await getFeatureElevations(reqBody);

    return res.status(200).json(elevations);
  } catch (error) {
    return catchApiResponse(
      res,
      error,
      `Something went wrong attempting to get the feature elevations`
    );
  }
};
