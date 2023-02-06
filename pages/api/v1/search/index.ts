import type { NextApiHandler, NextApiResponse } from 'next/types';
import { unstable_getServerSession } from 'next-auth';

import { searchRoutesAndUsers } from '@/lib/v1/search';
import { SearchRecord } from '@/types';
import {
  allowApiMethods,
  catchApiResponse,
  getQueryParam,
  StatusError,
} from '@/utils';
import { authOptions } from '../../auth/[...nextauth]';

type GetResponse = NextApiResponse<SearchRecord[]> | void;

const handler: NextApiHandler = async (req, res): Promise<GetResponse> => {
  allowApiMethods(req, res, ['GET']);

  switch (req.method) {
    case 'GET':
    default:
      return (await getHandler(req, res)) as GetResponse;
  }
};

export default handler;

// GET: routes + users
const getHandler: NextApiHandler = async (req, res): Promise<GetResponse> => {
  const q = getQueryParam(req.query, 'q');

  try {
    if (!q) {
      throw new StatusError(400, `Search query is missing`);
    }

    // session is optional
    const session = await unstable_getServerSession(req, res, authOptions);

    const results = await searchRoutesAndUsers(session, q);

    return res.status(200).json(results);
  } catch (error) {
    return catchApiResponse(
      res,
      error,
      `Something went wrong with your search`
    );
  }
};
