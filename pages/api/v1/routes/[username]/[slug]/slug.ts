import type { NextApiHandler, NextApiResponse } from 'next/types';
import { unstable_getServerSession } from 'next-auth';

import { changeRouteSlug } from '@/lib/v1/routes';
import { getUserPropertiesOrThrow } from '@/lib/v1/user';
import {
  allowApiMethods,
  catchApiResponse,
  getQueryParam,
  StatusError,
} from '@/utils';
import { authOptions } from '../../../../auth/[...nextauth]';

type PutResponse = NextApiResponse<object> | void;

const handler: NextApiHandler = async (req, res): Promise<PutResponse> => {
  allowApiMethods(req, res, ['PUT']);

  switch (req.method) {
    case 'PUT':
    default:
      return (await updateHandler(req, res)) as PutResponse;
  }
};

export default handler;

// PUT: route slug
const updateHandler: NextApiHandler = async (
  req,
  res
): Promise<PutResponse> => {
  const username = getQueryParam(req.query, 'username');
  const slug = getQueryParam(req.query, 'slug');

  const reqBody = JSON.parse(req.body);

  try {
    const session = await unstable_getServerSession(req, res, authOptions);

    const authUser = await getUserPropertiesOrThrow(
      session,
      ['username'],
      `You must be signed in to change a route slug`
    );

    // only route owner can change the slug
    if (authUser.username !== username) {
      throw new StatusError(
        403,
        `Only the route owner can change the route slug`
      );
    }

    await changeRouteSlug(username, slug, reqBody.slug);

    return res.status(200).json({});
  } catch (error) {
    return catchApiResponse(
      res,
      error,
      `Something went wrong attempting to change the route slug`
    );
  }
};
