import type { NextApiHandler, NextApiResponse } from 'next/types';
import { unstable_getServerSession } from 'next-auth/next';

import { addRoute, getRoutes } from '@/lib/v1/routes';
import { getUserPropertiesOrThrow } from '@/lib/v1/user';
import { PaginatedRoutes, Route } from '@/types/routes';
import { allowApiMethods, catchApiResponse, getQueryParam } from '@/utils';
import { authOptions } from '../../auth/[...nextauth]';

type GetResponse = NextApiResponse<PaginatedRoutes> | void;
type PostResponse = NextApiResponse<Route> | void;

const handler: NextApiHandler = async (
  req,
  res
): Promise<GetResponse | PostResponse> => {
  allowApiMethods(req, res, ['GET', 'POST']);

  switch (req.method) {
    case 'POST':
      return (await createHandler(req, res)) as PostResponse;
    case 'GET':
    default:
      return (await getHandler(req, res)) as GetResponse;
  }
};

export default handler;

// GET: routes
const getHandler: NextApiHandler = async (req, res): Promise<GetResponse> => {
  const size = getQueryParam(req.query, 'size');
  const after = getQueryParam(req.query, 'after');

  try {
    const routes = await getRoutes({ size, after });

    return res.status(200).json(routes);
  } catch (error) {
    return catchApiResponse(
      res,
      error,
      `Something went wrong getting the routes`
    );
  }
};

// POST: route
const createHandler: NextApiHandler = async (
  req,
  res
): Promise<PostResponse> => {
  const reqBody = JSON.parse(req.body);

  try {
    const session = await unstable_getServerSession(req, res, authOptions);

    // auth required
    const authUser = await getUserPropertiesOrThrow(
      session,
      ['stats_routes', 'stats_commits'],
      `You must be signed in to add a route`
    );

    const route = await addRoute(authUser, reqBody);

    return res.status(200).json(route);
  } catch (error) {
    return catchApiResponse(
      res,
      error,
      `Something went wrong attempting to add the route`
    );
  }
};
