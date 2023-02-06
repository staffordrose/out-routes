import type { NextApiHandler, NextApiResponse } from 'next/types';

import { getFollowingByUsername } from '@/lib/v1/users';
import { PaginatedFollowing } from '@/types';
import { allowApiMethods, catchApiResponse, getQueryParam } from '@/utils';

type GetResponse = NextApiResponse<PaginatedFollowing> | void;

const handler: NextApiHandler = async (req, res): Promise<GetResponse> => {
  allowApiMethods(req, res, ['GET']);

  switch (req.method) {
    case 'GET':
    default:
      return (await getHandler(req, res)) as GetResponse;
  }
};

export default handler;

// GET: user's following
const getHandler: NextApiHandler = async (req, res): Promise<GetResponse> => {
  const username = getQueryParam(req.query, 'username');
  const size = getQueryParam(req.query, 'size');
  const after = getQueryParam(req.query, 'after');

  try {
    const following = await getFollowingByUsername(username, { size, after });

    return res.status(200).json(following);
  } catch (error) {
    return catchApiResponse(
      res,
      error,
      `Something went wrong getting ${
        username ? `@${username}'s following` : `the user's following`
      }`
    );
  }
};
