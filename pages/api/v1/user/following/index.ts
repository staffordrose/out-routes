import type { NextApiHandler, NextApiResponse } from 'next/types';
import { unstable_getServerSession } from 'next-auth';

import { getFollowingIds, getUserIdOrThrow } from '@/lib/v1/user';
import { User } from '@/types/users';
import { allowApiMethods, catchApiResponse } from '@/utils';
import { authOptions } from '../../../auth/[...nextauth]';

type GetResponse = NextApiResponse<User['id'][]> | void;

const handler: NextApiHandler = async (req, res): Promise<GetResponse> => {
  allowApiMethods(req, res, ['GET']);

  switch (req.method) {
    case 'GET':
    default:
      return (await getHandler(req, res)) as GetResponse;
  }
};

export default handler;

// GET: following ids
const getHandler: NextApiHandler = async (req, res): Promise<GetResponse> => {
  try {
    const session = await unstable_getServerSession(req, res, authOptions);

    // auth required
    const authUserId = await getUserIdOrThrow(
      session,
      `You must be signed in to get the users you follow`
    );

    const followingIds = await getFollowingIds(authUserId);

    return res.status(200).json(followingIds);
  } catch (error) {
    return catchApiResponse(
      res,
      error,
      `Something went wrong getting the users you follow`
    );
  }
};
