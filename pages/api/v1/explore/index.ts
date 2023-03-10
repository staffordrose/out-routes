import type { NextApiHandler, NextApiResponse } from 'next/types';

import { getExploreRoutes } from '@/lib/v1/explore';
import { RouteLayersFeatures } from '@/types/routes';
import { allowApiMethods, catchApiResponse, getQueryParam } from '@/utils';

type GetResponse = NextApiResponse<RouteLayersFeatures> | void;

const handler: NextApiHandler = async (req, res): Promise<GetResponse> => {
  allowApiMethods(req, res, ['GET']);

  switch (req.method) {
    case 'GET':
    default:
      return (await getHandler(req, res)) as GetResponse;
  }
};

export default handler;

// GET: explore routes
const getHandler: NextApiHandler = async (req, res): Promise<GetResponse> => {
  const bounds = getQueryParam(req.query, 'bounds');
  const size = getQueryParam(req.query, 'size');
  const after = getQueryParam(req.query, 'after');

  try {
    const routes = await getExploreRoutes(bounds, {
      size,
      after,
    });

    return res.status(200).json(routes);
  } catch (error) {
    return catchApiResponse(
      res,
      error,
      `Something went wrong getting the map routes`
    );
  }
};
