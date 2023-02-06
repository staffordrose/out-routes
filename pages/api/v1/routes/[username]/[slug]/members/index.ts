import type { NextApiHandler, NextApiResponse } from 'next/types';
import { unstable_getServerSession } from 'next-auth';

import {
  getRouteMembersByUsernameSlug,
  getRouteVisibilityByUsernameSlug,
} from '@/lib/v1/routes';
import { getUserIdOrThrow, isAuthRouteMember } from '@/lib/v1/user';
import { PaginatedMembers } from '@/types';
import {
  allowApiMethods,
  catchApiResponse,
  getQueryParam,
  StatusError,
} from '@/utils';
import { authOptions } from '../../../../../auth/[...nextauth]';

type GetResponse = NextApiResponse<PaginatedMembers> | void;

const handler: NextApiHandler = async (req, res): Promise<GetResponse> => {
  allowApiMethods(req, res, ['GET']);

  switch (req.method) {
    case 'GET':
    default:
      return (await getHandler(req, res)) as GetResponse;
  }
};

export default handler;

// GET: route members
const getHandler: NextApiHandler = async (req, res): Promise<GetResponse> => {
  const username = getQueryParam(req.query, 'username');
  const slug = getQueryParam(req.query, 'slug');
  const size = getQueryParam(req.query, 'size');
  const after = getQueryParam(req.query, 'after');

  try {
    const route = await getRouteVisibilityByUsernameSlug(username, slug);

    if (typeof route.is_private !== 'boolean' || route.is_private) {
      const session = await unstable_getServerSession(req, res, authOptions);

      // auth required
      const authUserId = await getUserIdOrThrow(
        session,
        `You must be signed in to view the route members`
      );

      const isMember = await isAuthRouteMember(authUserId, username, slug);

      if (!isMember) {
        throw new StatusError(
          403,
          `You must be added as a member to view the route members`
        );
      }
    }

    const members = await getRouteMembersByUsernameSlug(username, slug, {
      size,
      after,
    });

    return res.status(200).json(members);
  } catch (error) {
    return catchApiResponse(
      res,
      error,
      `Something went wrong getting ${
        username && slug ? `${username}/${slug} members` : `the route members`
      }`
    );
  }
};
