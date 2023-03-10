import type { NextApiHandler, NextApiResponse } from 'next/types';

import { getFollowersByUsername } from '@/lib/v1/users';
import { PaginatedFollowers } from '@/types/user-relationships';
import { allowApiMethods, catchApiResponse, getQueryParam } from '@/utils';

type GetResponse = NextApiResponse<PaginatedFollowers> | void;

const handler: NextApiHandler = async (req, res): Promise<GetResponse> => {
  allowApiMethods(req, res, ['GET']);

  switch (req.method) {
    case 'GET':
    default:
      return (await getHandler(req, res)) as GetResponse;
  }
};

export default handler;

// GET: user's followers
const getHandler: NextApiHandler = async (req, res): Promise<GetResponse> => {
  const username = getQueryParam(req.query, 'username');
  const size = getQueryParam(req.query, 'size');
  const after = getQueryParam(req.query, 'after');

  try {
    const followers = await getFollowersByUsername(username, { size, after });

    return res.status(200).json(followers);
  } catch (error) {
    return catchApiResponse(
      res,
      error,
      `Something went wrong getting ${
        username ? `@${username}'s followers` : `the user's followers`
      }`
    );
  }
};
