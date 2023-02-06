import type { NextApiHandler, NextApiResponse } from 'next/types';
import { unstable_getServerSession } from 'next-auth';

import { getFavoritesIds, getUserIdOrThrow } from '@/lib/v1/user';
import { Route } from '@/types';
import { allowApiMethods, catchApiResponse } from '@/utils';
import { authOptions } from '../../../auth/[...nextauth]';

type GetResponse = NextApiResponse<Route['id'][]> | void;

const handler: NextApiHandler = async (req, res): Promise<GetResponse> => {
  allowApiMethods(req, res, ['GET']);

  switch (req.method) {
    case 'GET':
    default:
      return (await getHandler(req, res)) as GetResponse;
  }
};

export default handler;

// GET: favorite route ids
const getHandler: NextApiHandler = async (req, res): Promise<GetResponse> => {
  try {
    const session = await unstable_getServerSession(req, res, authOptions);

    // auth required
    const authUserId = await getUserIdOrThrow(
      session,
      `You must be signed in to get your starred routes`
    );

    const favoritesIds = await getFavoritesIds(authUserId);

    return res.status(200).json(favoritesIds);
  } catch (error) {
    return catchApiResponse(
      res,
      error,
      `Something went wrong getting your starred routes`
    );
  }
};
