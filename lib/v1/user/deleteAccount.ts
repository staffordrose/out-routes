import { User } from '@/types/users';
import { StatusError } from '@/utils';
import { getXataClient } from '@/xata';
import { deleteRoute } from '../routes';
import { unfavoriteRoute, unfollowUser } from '.';

export const deleteAccount = async (authUserId: User['id']): Promise<void> => {
  try {
    const xata = getXataClient();

    const authUser = await xata.db.users
      .filter('id', authUserId)
      .select(['*'])
      .getFirst();

    if (!authUser) {
      throw new StatusError(403, `There is no record of your account`);
    }

    const routes = await xata.db.routes
      .filter('owner.id', authUserId)
      .select(['*'])
      .getAll();

    // delete routes
    if (Array.isArray(routes) && routes.length) {
      const routePromises = routes.map((route) =>
        deleteRoute(authUser, authUser.username, route.slug)
      );

      await Promise.all(routePromises);
    }

    const favorites = await xata.db.route_favorites
      .filter({ user: authUserId })
      .select(['id', 'route.owner.username', 'route.slug'])
      .getFirst();

    // delete favorites
    if (Array.isArray(favorites) && favorites.length) {
      const favoritePromises = favorites.map((favorite) =>
        unfavoriteRoute(
          authUser,
          favorite.route.owner.username,
          favorite.route.slug
        )
      );

      await Promise.all(favoritePromises);
    }

    const followerRelationships = await xata.db.user_relationships
      .filter({ follower: authUserId })
      .select(['id', 'followed.username'])
      .getFirst();

    // delete user relationships where auth is follower
    if (Array.isArray(followerRelationships) && followerRelationships.length) {
      const relationshipPromises = followerRelationships.map((relationship) =>
        unfollowUser(authUser, relationship.followed.username)
      );

      await Promise.all(relationshipPromises);
    }

    const followedRelationships = await xata.db.user_relationships
      .filter({ followed: authUserId })
      .select(['id', 'follower.*'])
      .getFirst();

    // delete user relationships where auth is followed
    if (Array.isArray(followedRelationships) && followedRelationships.length) {
      const relationshipPromises = followedRelationships.map((relationship) =>
        unfollowUser(relationship.follower, authUser.username)
      );

      await Promise.all(relationshipPromises);
    }

    // delete users table row
    await authUser.delete();

    const [verificationToken, userSession, session, user, account] =
      await Promise.all([
        xata.db.nextauth_verificationTokens
          .filter('id', authUserId)
          .select(['id'])
          .getFirst(),
        xata.db.nextauth_users_sessions
          .filter('user.id', authUserId)
          .select(['id'])
          .getFirst(),
        xata.db.nextauth_sessions
          .filter('user.id', authUserId)
          .select(['id'])
          .getFirst(),
        xata.db.nextauth_users
          .filter('id', authUserId)
          .select(['id'])
          .getFirst(),
        xata.db.nextauth_accounts
          .filter('user.id', authUserId)
          .select(['id'])
          .getFirst(),
      ]);

    // delete auth verification token
    if (verificationToken) {
      await xata.db.nextauth_verificationTokens.delete(verificationToken.id);
    }

    // delete auth users/sessions join table row
    if (userSession) {
      await xata.db.nextauth_users_sessions.delete(userSession.id);
    }

    // delete auth session
    if (session) {
      await xata.db.nextauth_sessions.delete(session.id);
    }

    // delete auth user
    if (user) {
      await xata.db.nextauth_users.delete(user.id);
    }

    // delete auth account
    if (account) {
      await xata.db.nextauth_accounts.delete(account.id);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new StatusError(400, `Something went wrong deleting your account`);
    }
  }
};
