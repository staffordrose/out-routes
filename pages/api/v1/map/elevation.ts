import type { NextApiHandler, NextApiResponse } from 'next/types';

import { getElevationByLngLat } from '@/lib/v1/map';
import { allowApiMethods, catchApiResponse, getQueryParam } from '@/utils';

type GetResponse = NextApiResponse<number> | void;

const handler: NextApiHandler = async (req, res): Promise<GetResponse> => {
  allowApiMethods(req, res, ['GET']);

  switch (req.method) {
    case 'GET':
    default:
      return (await getHandler(req, res)) as GetResponse;
  }
};

export default handler;

// GET: feature elevation
const getHandler: NextApiHandler = async (req, res): Promise<GetResponse> => {
  const lng = getQueryParam(req.query, 'lng');
  const lat = getQueryParam(req.query, 'lat');

  try {
    const elevation = await getElevationByLngLat([Number(lng), Number(lat)]);

    return res.status(200).json(elevation);
  } catch (error) {
    return catchApiResponse(
      res,
      error,
      `Something went wrong attempting to get the elevation`
    );
  }
};
