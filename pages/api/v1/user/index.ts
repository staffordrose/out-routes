import type { NextApiHandler, NextApiResponse } from 'next/types';
import { unstable_getServerSession } from 'next-auth';

import { deleteAccount, getUserIdOrThrow } from '@/lib/v1/user';
import { allowApiMethods, catchApiResponse } from '@/utils';
import { authOptions } from '../../auth/[...nextauth]';

type DeleteResponse = NextApiResponse<object> | void;

const handler: NextApiHandler = async (req, res): Promise<DeleteResponse> => {
  allowApiMethods(req, res, ['DELETE']);

  switch (req.method) {
    case 'DELETE':
    default:
      return (await deleteHandler(req, res)) as DeleteResponse;
  }
};

export default handler;

// DELETE: user account
const deleteHandler: NextApiHandler = async (
  req,
  res
): Promise<DeleteResponse> => {
  try {
    const session = await unstable_getServerSession(req, res, authOptions);

    // auth required
    const authUserId = await getUserIdOrThrow(
      session,
      `You must be signed in to delete your account`
    );

    await deleteAccount(authUserId);

    return res.status(200).json({});
  } catch (error) {
    return catchApiResponse(
      res,
      error,
      `Something went wrong while attempting to delete your account`
    );
  }
};
