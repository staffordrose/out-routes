import type { NextApiHandler, NextApiResponse } from 'next/types';
import { unstable_getServerSession } from 'next-auth';

import { changeUsername, getUserPropertiesOrThrow } from '@/lib/v1/user';
import { User } from '@/types';
import { allowApiMethods, catchApiResponse } from '@/utils';
import { authOptions } from '../../auth/[...nextauth]';

type PutResponse = NextApiResponse<User['username']> | void;

const handler: NextApiHandler = async (req, res): Promise<PutResponse> => {
  allowApiMethods(req, res, ['PUT']);

  switch (req.method) {
    case 'PUT':
    default:
      return (await updateHandler(req, res)) as PutResponse;
  }
};

export default handler;

// PUT: username
const updateHandler: NextApiHandler = async (
  req,
  res
): Promise<PutResponse> => {
  const reqBody = JSON.parse(req.body);

  try {
    const session = await unstable_getServerSession(req, res, authOptions);

    // auth required
    const authUser = await getUserPropertiesOrThrow(
      session,
      ['username', 'username_updated_at'],
      `You must be signed in to change your username`
    );

    const updatedUsername = await changeUsername(authUser, reqBody.username);

    return res.status(200).json(updatedUsername);
  } catch (error) {
    return catchApiResponse(
      res,
      error,
      `Something went wrong changing your username`
    );
  }
};
