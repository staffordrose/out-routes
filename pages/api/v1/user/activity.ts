import type { NextApiHandler, NextApiResponse } from 'next/types';
import { unstable_getServerSession } from 'next-auth';

import { getActivityFeed, getUserIdOrThrow } from '@/lib/v1/user';
import { User } from '@/types/users';
import { allowApiMethods, catchApiResponse, getQueryParam } from '@/utils';
import { authOptions } from '../../auth/[...nextauth]';

type GetResponse = NextApiResponse<User> | void;

const handler: NextApiHandler = async (req, res): Promise<GetResponse> => {
  allowApiMethods(req, res, ['GET']);

  switch (req.method) {
    case 'GET':
    default:
      return (await getHandler(req, res)) as GetResponse;
  }
};

export default handler;

// GET: user activity feed
const getHandler: NextApiHandler = async (req, res): Promise<GetResponse> => {
  const size = getQueryParam(req.query, 'size');
  const after = getQueryParam(req.query, 'after');

  try {
    const session = await unstable_getServerSession(req, res, authOptions);

    // auth required
    const authUserId = await getUserIdOrThrow(
      session,
      `You must be signed in to get your activity feed`
    );

    const user = await getActivityFeed(authUserId, { size, after });

    return res.status(200).json(user);
  } catch (error) {
    return catchApiResponse(
      res,
      error,
      `Something went wrong getting your activity feed`
    );
  }
};
