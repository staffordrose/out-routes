import type { NextApiHandler, NextApiResponse } from 'next/types';
import { unstable_getServerSession } from 'next-auth';

import {
  deleteRoute,
  getRouteByUsernameSlug,
  updateRoute,
} from '@/lib/v1/routes';
import {
  isAuthRouteMember,
  getUserIdOrThrow,
  getUserPropertiesOrThrow,
  getAuthRouteMemberRoleByUsernameSlug,
} from '@/lib/v1/user';
import { MemberRoles, memberRoles } from '@/data/routes';
import { Route, RouteLayersFeatures } from '@/types';
import {
  allowApiMethods,
  catchApiResponse,
  getQueryParam,
  StatusError,
} from '@/utils';
import { authOptions } from '../../../../auth/[...nextauth]';

type GetResponse = NextApiResponse<RouteLayersFeatures> | void;
type PutResponse = NextApiResponse<Route> | void;
type DeleteResponse = NextApiResponse<object> | void;

const handler: NextApiHandler = async (
  req,
  res
): Promise<GetResponse | PutResponse | DeleteResponse> => {
  allowApiMethods(req, res, ['GET', 'PUT', 'DELETE']);

  switch (req.method) {
    case 'PUT':
      return (await updateHandler(req, res)) as PutResponse;
    case 'DELETE':
      return (await deleteHandler(req, res)) as DeleteResponse;
    case 'GET':
    default:
      return (await getHandler(req, res)) as GetResponse;
  }
};

export default handler;

// GET: route
const getHandler: NextApiHandler = async (req, res): Promise<GetResponse> => {
  const username = getQueryParam(req.query, 'username');
  const slug = getQueryParam(req.query, 'slug');

  try {
    const RouteLayersFeatures = await getRouteByUsernameSlug(username, slug);

    const { route } = RouteLayersFeatures;

    // only members can view route
    if (typeof route.is_private !== 'boolean' || route.is_private) {
      const session = await unstable_getServerSession(req, res, authOptions);

      const authUserId = await getUserIdOrThrow(
        session,
        `You must be signed in to view this route`
      );

      const isMember = await isAuthRouteMember(authUserId, username, slug);

      if (!isMember) {
        throw new StatusError(
          403,
          `You must be added as a member to view this route`
        );
      }
    }

    return res.status(200).json(RouteLayersFeatures);
  } catch (error) {
    return catchApiResponse(
      res,
      error,
      `Something went wrong getting the route`
    );
  }
};

// PUT: route
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
      ['stats_commits'],
      `You must be signed in to make changes to a route`
    );

    const authRouteMemberRole = await getAuthRouteMemberRoleByUsernameSlug(
      authUser.id,
      username,
      slug
    );

    // only admins & moderators can commit changes
    if (
      ![memberRoles.admin, memberRoles.moderator].includes(
        authRouteMemberRole as MemberRoles
      )
    ) {
      throw new StatusError(
        403,
        `You don't have the required permissions to edit the route directly`
      );
    }

    const route = await updateRoute(authUser, username, slug, reqBody);

    return res.status(200).json(route);
  } catch (error) {
    return catchApiResponse(
      res,
      error,
      `Something went wrong attempting to update the route`
    );
  }
};

// DELETE: route
const deleteHandler: NextApiHandler = async (
  req,
  res
): Promise<DeleteResponse> => {
  const username = getQueryParam(req.query, 'username');
  const slug = getQueryParam(req.query, 'slug');

  try {
    const session = await unstable_getServerSession(req, res, authOptions);

    const authUser = await getUserPropertiesOrThrow(
      session,
      ['stats_routes', 'stats_commits'],
      `You must be logged in to delete a route`
    );

    await deleteRoute(authUser, username, slug);

    return res.status(200).json({});
  } catch (error) {
    return catchApiResponse(
      res,
      error,
      `Something went wrong attempting to delete the route`
    );
  }
};
