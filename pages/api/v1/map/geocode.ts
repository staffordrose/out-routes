import type { NextApiHandler, NextApiResponse } from 'next/types';

import { geocodeQuery } from '@/lib/v1/map';
import { GeocodingResponse } from '@/types/maps';
import { allowApiMethods, catchApiResponse, getQueryParam } from '@/utils';

type GetResponse = NextApiResponse<GeocodingResponse> | void;

const handler: NextApiHandler = async (req, res): Promise<GetResponse> => {
  allowApiMethods(req, res, ['GET']);

  switch (req.method) {
    case 'GET':
    default:
      return (await getHandler(req, res)) as GetResponse;
  }
};

export default handler;

// GET: geocode query
const getHandler: NextApiHandler = async (req, res): Promise<GetResponse> => {
  const q = getQueryParam(req.query, 'q');

  try {
    const geocodingResponse = await geocodeQuery(q);

    return res.status(200).json(geocodingResponse);
  } catch (error) {
    return catchApiResponse(
      res,
      error,
      `Something went wrong with your search`
    );
  }
};
