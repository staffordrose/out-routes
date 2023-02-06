import type { NextApiHandler, NextApiResponse } from 'next/types';
import { unstable_getServerSession } from 'next-auth';

import {
  getUserIdOrThrow,
  getUserPropertiesOrThrow,
  followUser,
  isAuthFollowingUser,
  unfollowUser,
} from '@/lib/v1/user';
import { allowApiMethods, catchApiResponse, getQueryParam } from '@/utils';
import { authOptions } from '../../../auth/[...nextauth]';

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

// GET: is auth following user
const getHandler: NextApiHandler = async (req, res): Promise<GetResponse> => {
  const username = getQueryParam(req.query, 'username');

  try {
    const session = await unstable_getServerSession(req, res, authOptions);

    // auth required
    const authUserId = await getUserIdOrThrow(
      session,
      `You must be signed in to check if you are following ${
        username ? `@${username}` : `a user`
      }`
    );

    const isFollowing = await isAuthFollowingUser(authUserId, username);

    return res.status(200).json(isFollowing);
  } catch (error) {
    return catchApiResponse(
      res,
      error,
      `Something went wrong checking if you are following ${
        username ? `@${username}` : `a user`
      }`
    );
  }
};

// PUT: follow user
const createHandler: NextApiHandler = async (
  req,
  res
): Promise<SharedResponse> => {
  const username = getQueryParam(req.query, 'username');

  try {
    const session = await unstable_getServerSession(req, res, authOptions);

    // auth required
    const authUser = await getUserPropertiesOrThrow(
      session,
      ['username', 'stats_following'],
      `You must be signed in to follow another user`
    );

    await followUser(authUser, username);

    return res.status(200).json({});
  } catch (error) {
    return catchApiResponse(
      res,
      error,
      `Something went wrong attempting to follow ${
        username ? `@${username}` : `a user`
      }`
    );
  }
};

// DELETE: unfollow user
const deleteHandler: NextApiHandler = async (
  req,
  res
): Promise<SharedResponse> => {
  const username = getQueryParam(req.query, 'username');

  try {
    const session = await unstable_getServerSession(req, res, authOptions);

    // auth required
    const authUser = await getUserPropertiesOrThrow(
      session,
      ['username', 'stats_following'],
      `You must be signed in to unfollow another user`
    );

    await unfollowUser(authUser, username);

    return res.status(200).json({});
  } catch (error) {
    return catchApiResponse(
      res,
      error,
      `Something went wrong attempting to unfollow ${
        username ? `@${username}` : `a user`
      }`
    );
  }
};
