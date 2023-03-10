import type { NextApiHandler, NextApiResponse } from 'next/types';

import { getRouteFavoritesByUsernameSlug } from '@/lib/v1/routes';
import { PaginatedFavorites } from '@/types/favorites';
import { allowApiMethods, catchApiResponse, getQueryParam } from '@/utils';

type GetResponse = NextApiResponse<PaginatedFavorites> | void;

const handler: NextApiHandler = async (req, res): Promise<GetResponse> => {
  allowApiMethods(req, res, ['GET']);

  switch (req.method) {
    case 'GET':
    default:
      return (await getHandler(req, res)) as GetResponse;
  }
};

export default handler;

// GET: route favorites
const getHandler: NextApiHandler = async (req, res): Promise<GetResponse> => {
  const username = getQueryParam(req.query, 'username');
  const slug = getQueryParam(req.query, 'slug');
  const size = getQueryParam(req.query, 'size');
  const after = getQueryParam(req.query, 'after');

  try {
    const favorites = await getRouteFavoritesByUsernameSlug(username, slug, {
      size,
      after,
    });

    return res.status(200).json(favorites);
  } catch (error) {
    return catchApiResponse(
      res,
      error,
      `Something went wrong getting the users who starred ${
        username && slug ? `${username}/${slug}` : `the route`
      }`
    );
  }
};
