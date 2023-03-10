import type { NextApiHandler, NextApiResponse } from 'next/types';
import { unstable_getServerSession } from 'next-auth';

import {
  forkRoute,
  getRouteForksByUsernameSlug,
  getRouteVisibilityByUsernameSlug,
} from '@/lib/v1/routes';
import {
  getUserIdOrThrow,
  getUserPropertiesOrThrow,
  isAuthRouteMember,
} from '@/lib/v1/user';
import { PaginatedRoutes, Route } from '@/types/routes';
import {
  allowApiMethods,
  catchApiResponse,
  getQueryParam,
  StatusError,
} from '@/utils';
import { authOptions } from '../../../../../auth/[...nextauth]';

type GetResponse = NextApiResponse<PaginatedRoutes> | void;
type PostResponse = NextApiResponse<Route> | void;

const handler: NextApiHandler = async (
  req,
  res
): Promise<GetResponse | PostResponse> => {
  allowApiMethods(req, res, ['GET', 'POST']);

  switch (req.method) {
    case 'POST':
      return (await postHandler(req, res)) as PostResponse;
    case 'GET':
    default:
      return (await getHandler(req, res)) as GetResponse;
  }
};

export default handler;

// GET: route forks
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
        `You must be signed in to view the route forks`
      );

      const isMember = await isAuthRouteMember(authUserId, username, slug);

      if (!isMember) {
        throw new StatusError(
          403,
          `You must be added as a member to view the route forks`
        );
      }
    }

    const forks = await getRouteForksByUsernameSlug(username, slug, {
      size,
      after,
    });

    return res.status(200).json(forks);
  } catch (error) {
    return catchApiResponse(
      res,
      error,
      `Something went wrong getting ${
        username && slug ? `${username}/${slug} forks` : `the route forks`
      }`
    );
  }
};

// POST: fork route
const postHandler: NextApiHandler = async (req, res): Promise<PostResponse> => {
  const username = getQueryParam(req.query, 'username');
  const slug = getQueryParam(req.query, 'slug');

  try {
    const route = await getRouteVisibilityByUsernameSlug(username, slug);

    if (typeof route.is_private !== 'boolean' || route.is_private) {
      throw new StatusError(403, `Only public routes can be forked`);
    }

    const session = await unstable_getServerSession(req, res, authOptions);

    // auth required
    const authUser = await getUserPropertiesOrThrow(
      session,
      ['stats_routes', 'stats_commits'],
      `You must be signed in to fork a route`
    );

    const forkedRoute = await forkRoute(authUser, username, slug);

    return res.status(200).json(forkedRoute);
  } catch (error) {
    return catchApiResponse(
      res,
      error,
      `Something went forking ${
        username && slug ? `${username}/${slug}` : `the route`
      }`
    );
  }
};
