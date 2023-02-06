import type { NextApiHandler, NextApiResponse } from 'next/types';

import { getUsers } from '@/lib/v1/users';
import { PaginatedUsers } from '@/types';
import { allowApiMethods, catchApiResponse, getQueryParam } from '@/utils';

type GetResponse = NextApiResponse<PaginatedUsers> | void;

const handler: NextApiHandler = async (req, res): Promise<GetResponse> => {
  allowApiMethods(req, res, ['GET']);

  switch (req.method) {
    case 'GET':
    default:
      return (await getHandler(req, res)) as GetResponse;
  }
};

export default handler;

// GET: users
const getHandler: NextApiHandler = async (req, res): Promise<GetResponse> => {
  const size = getQueryParam(req.query, 'size');
  const after = getQueryParam(req.query, 'after');

  try {
    const users = await getUsers({ size, after });

    return res.status(200).json(users);
  } catch (error) {
    return catchApiResponse(res, error, `Something went wrong getting users`);
  }
};
