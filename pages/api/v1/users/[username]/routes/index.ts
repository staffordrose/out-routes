import type { NextApiHandler, NextApiResponse } from 'next/types';
import { unstable_getServerSession } from 'next-auth';

import { getUserId } from '@/lib/v1/user';
import { getRoutesByUsername } from '@/lib/v1/users';
import { PaginatedRoutes } from '@/types';
import { allowApiMethods, catchApiResponse, getQueryParam } from '@/utils';
import { authOptions } from '../../../../auth/[...nextauth]';

type GetResponse = NextApiResponse<PaginatedRoutes> | void;

const handler: NextApiHandler = async (req, res): Promise<GetResponse> => {
  allowApiMethods(req, res, ['GET']);

  switch (req.method) {
    case 'GET':
    default:
      return (await getHandler(req, res)) as GetResponse;
  }
};

export default handler;

// GET: user's routes
const getHandler: NextApiHandler = async (req, res): Promise<GetResponse> => {
  const username = getQueryParam(req.query, 'username');
  const size = getQueryParam(req.query, 'size');
  const after = getQueryParam(req.query, 'after');

  try {
    const session = await unstable_getServerSession(req, res, authOptions);

    // auth optional
    const authUserId = await getUserId(session);

    const routes = await getRoutesByUsername(authUserId, username, {
      size,
      after,
    });

    return res.status(200).json(routes);
  } catch (error) {
    return catchApiResponse(
      res,
      error,
      `Something went wrong getting ${
        username ? `@${username}'s routes` : `the user's routes`
      }`
    );
  }
};
