import slugify from 'slugify';

import { Route, User } from '@/types';
import { StatusError, validateSlug } from '@/utils';
import { getXataClient } from '@/xata';

export const changeRouteSlug = async (
  username: User['username'],
  slug: Route['slug'],
  nextSlug: Route['slug']
): Promise<void> => {
  try {
    // username is missing
    if (!username) {
      throw new StatusError(
        400,
        `A valid username is required to change the route slug`
      );
    }

    // slug is missing
    if (!slug) {
      throw new StatusError(
        400,
        `The current route slug is required to change the route slug`
      );
    }

    // nextSlug is missing
    if (!nextSlug) {
      throw new StatusError(400, `The new route slug is required`);
    }

    const xata = getXataClient();

    const route = await xata.db.routes
      .filter({ 'owner.username': username, slug })
      .select(['owner.id'])
      .getFirst();

    // route does not exist
    if (!route) {
      throw new StatusError(
        404,
        `A route does not exist for the provided username and slug`
      );
    }

    // slugify nextSlug
    const slugifiedNextSlug = slugify(nextSlug).toLowerCase();

    // prevent slug from using reserved words
    validateSlug(slugifiedNextSlug);

    const existingOwnerRoute = await xata.db.routes
      .filter({ 'owner.username': username, slug: slugifiedNextSlug })
      .select(['id'])
      .getFirst();

    // nextSlug matches another route belonging to owner
    if (existingOwnerRoute) {
      throw new StatusError(
        400,
        `You already have a route with the slug '${slugifiedNextSlug}'`
      );
    }

    // change the slug
    await xata.db.routes.update(route.id, {
      updated_at: new Date(),
      slug: slugifiedNextSlug,
    });
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new StatusError(
        400,
        `Something went wrong attempting to change the route slug`
      );
    }
  }
};
