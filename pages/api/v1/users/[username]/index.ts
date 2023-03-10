import type { NextApiHandler, NextApiResponse } from 'next/types';

import { getUserByUsername } from '@/lib/v1/users';
import { User } from '@/types/users';
import { allowApiMethods, catchApiResponse, getQueryParam } from '@/utils';

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

// GET: user
const getHandler: NextApiHandler = async (req, res): Promise<GetResponse> => {
  const username = getQueryParam(req.query, 'username');

  try {
    const user = await getUserByUsername(username);

    return res.status(200).json(user);
  } catch (error) {
    return catchApiResponse(
      res,
      error,
      `Something went wrong getting ${username ? `@${username}` : `the user`}`
    );
  }
};
