import type { NextApiHandler, NextApiResponse } from 'next/types';
import { unstable_getServerSession } from 'next-auth';

import { getUserIdOrThrow, getUserOrThrow, updateUser } from '@/lib/v1/user';
import { User } from '@/types/users';
import { allowApiMethods, catchApiResponse } from '@/utils';
import { authOptions } from '../../auth/[...nextauth]';

type SharedResponse = NextApiResponse<User> | void;

const handler: NextApiHandler = async (req, res): Promise<SharedResponse> => {
  allowApiMethods(req, res, ['GET', 'PUT']);

  switch (req.method) {
    case 'PUT':
      return (await updateHandler(req, res)) as SharedResponse;
    case 'GET':
    default:
      return (await getHandler(req, res)) as SharedResponse;
  }
};

export default handler;

// GET: user profile
const getHandler: NextApiHandler = async (
  req,
  res
): Promise<SharedResponse> => {
  try {
    const session = await unstable_getServerSession(req, res, authOptions);

    const user = await getUserOrThrow(session);

    return res.status(200).json(user);
  } catch (error) {
    return catchApiResponse(
      res,
      error,
      `Something went wrong getting your profile`
    );
  }
};

// PUT: user profile
const updateHandler: NextApiHandler = async (
  req,
  res
): Promise<SharedResponse> => {
  const reqBody = JSON.parse(req.body);

  try {
    const session = await unstable_getServerSession(req, res, authOptions);

    // auth required
    const authUserId = await getUserIdOrThrow(
      session,
      `You must be signed in to update your profile`
    );

    const user = await updateUser(authUserId, reqBody);

    return res.status(200).json(user);
  } catch (error) {
    return catchApiResponse(
      res,
      error,
      `Something went wrong updating your profile`
    );
  }
};
