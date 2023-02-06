import type { NextApiHandler, NextApiResponse } from 'next/types';
import { unstable_getServerSession } from 'next-auth';

import {
  favoriteRoute,
  getUserIdOrThrow,
  getUserPropertiesOrThrow,
  isAuthFavoritingRoute,
  unfavoriteRoute,
} from '@/lib/v1/user';
import { allowApiMethods, catchApiResponse, getQueryParam } from '@/utils';
import { authOptions } from '../../../../auth/[...nextauth]';

type GetResponse = NextApiResponse<boolean> | void;
type SharedResponse = NextApiResponse<object> | void;

const handler: NextApiHandler = async (
  req,
  res
): Promise<GetResponse | SharedResponse> => {
  allowApiMethods(req, res, ['GET', 'PUT', 'DELETE']);

  switch (req.method) {
    case 'PUT':
      return (await createHandler(req, res)) as SharedResponse;
    case 'DELETE':
      return (await deleteHandler(req, res)) as SharedResponse;
    case 'GET':
    default:
      return (await getHandler(req, res)) as GetResponse;
  }
};

export default handler;

// GET: is auth favoriting route
const getHandler: NextApiHandler = async (req, res): Promise<GetResponse> => {
  const username = getQueryParam(req.query, 'username');
  const slug = getQueryParam(req.query, 'slug');

  try {
    const session = await unstable_getServerSession(req, res, authOptions);

    // auth required
    const authUserId = await getUserIdOrThrow(
      session,
      `You must be signed in to check if you've starred ${
        username && slug ? `${username}/${slug}` : `the route`
      }`
    );

    const isFavoriting = await isAuthFavoritingRoute(
      authUserId,
      username,
      slug
    );

    return res.status(200).json(isFavoriting);
  } catch (error) {
    return catchApiResponse(
      res,
      error,
      `Something went wrong checking if you've starred ${
        username && slug ? `${username}/${slug}` : `a route`
      }`
    );
  }
};

// PUT: favorite route
const createHandler: NextApiHandler = async (
  req,
  res
): Promise<SharedResponse> => {
  const username = getQueryParam(req.query, 'username');
  const slug = getQueryParam(req.query, 'slug');

  try {
    const session = await unstable_getServerSession(req, res, authOptions);

    // auth required
    const authUser = await getUserPropertiesOrThrow(
      session,
      ['username', 'stats_favorites'],
      `You must be signed in to star a route`
    );

    await favoriteRoute(authUser, username, slug);

    return res.status(200).json({});
  } catch (error) {
    return catchApiResponse(
      res,
      error,
      `Something went wrong attempting to star ${
        username && slug ? `${username}/${slug}` : `a route`
      }`
    );
  }
};

// DELETE: unfavorite route
const deleteHandler: NextApiHandler = async (
  req,
  res
): Promise<SharedResponse> => {
  const username = getQueryParam(req.query, 'username');
  const slug = getQueryParam(req.query, 'slug');

  try {
    const session = await unstable_getServerSession(req, res, authOptions);

    // auth required
    const authUser = await getUserPropertiesOrThrow(
      session,
      ['username', 'stats_favorites'],
      `You must be signed in to unstar a route`
    );

    await unfavoriteRoute(authUser, username, slug);

    return res.status(200).json({});
  } catch (error) {
    return catchApiResponse(
      res,
      error,
      `Something went wrong attempting to unstar ${
        username && slug ? `${username}/${slug}` : `a route`
      }`
    );
  }
};
