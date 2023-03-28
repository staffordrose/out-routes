import { FC, ReactNode } from 'react';
import type { GetServerSideProps } from 'next/types';
import { useRouter } from 'next/router';
import { unstable_getServerSession } from 'next-auth';
import {
  QueryClient,
  dehydrate,
  useQueries,
  useQueryClient,
} from '@tanstack/react-query';
import queryString from 'query-string';
import dayjs from 'dayjs';
import { BiCheck, BiMap, BiStar, BiUser } from 'react-icons/bi';
import { RxDotFilled } from 'react-icons/rx';

import {
  Avatar,
  Button,
  Flex,
  Grid,
  Link,
  Separator,
  Tabs,
  Toast,
  useToast,
} from '@/components/atoms';
import { DefaultLayout, Feedback, PageHeading } from '@/components/layout';
import { SEO } from '@/components/utility';
import { RouteCard } from '@/features/routes';
import { FavoritesList, FollowersList, FollowingList } from '@/features/users';
import { useQueryParam } from '@/hooks';
import {
  getFavoritesIds,
  getFollowingIds,
  isAuthFollowingUser,
  getUser,
} from '@/lib/v1/api/user';
import {
  getFavoritesByUsername,
  getFollowersByUsername,
  getFollowingByUsername,
  getUserByUsername,
  getRoutesByUsername,
} from '@/lib/v1/api/users';
import {
  useFavoriteMutation,
  useFollowMutation,
  useUnfavoriteMutation,
  useUnfollowMutation,
} from '@/lib/v1/hooks/user';
import {
  getFavoritesIds as getFavoritesIdsGSSP,
  getFollowingIds as getFollowingIdsGSSP,
  getUserId as getUserIdGSSP,
  isAuthFollowingUser as isAuthFollowingUserGSSP,
  getUserOrThrow as getUserOrThrowGSSP,
} from '@/lib/v1/user';
import {
  getFavoritesByUsername as getFavoritesByUsernameGSSP,
  getFollowersByUsername as getFollowersByUsernameGSSP,
  getFollowingByUsername as getFollowingByUsernameGSSP,
  getUserByUsername as getUserByUsernameGSSP,
  getRoutesByUsername as getRoutesByUsernameGSSP,
} from '@/lib/v1/users';
import { styled } from '@/styles';
import { PaginatedFavorites } from '@/types/favorites';
import { PaginatedRoutes, UsernameAndSlug } from '@/types/routes';
import {
  PaginatedFollowers,
  PaginatedFollowing,
} from '@/types/user-relationships';
import { User } from '@/types/users';
import { getQueryParam, shallowPush } from '@/utils';
import { authOptions } from '../api/auth/[...nextauth]';

const QUERY_SIZE = 8;

type TabValue = '' | 'routes' | 'followers' | 'following' | 'favorites';

type ProfileProps = {
  isAuthenticated: boolean;
};

const Profile = ({ isAuthenticated }: ProfileProps) => {
  const router = useRouter();

  const username = useQueryParam(router.query, 'username');
  const tab = useQueryParam(router.query, 'tab');

  const [userQuery, authUserQuery, isAuthFollowingUserQuery] = useQueries({
    queries: [
      {
        queryKey: ['users', username],
        queryFn: () => getUserByUsername(username),
        staleTime: 300_000,
        enabled: !!username,
      },
      {
        queryKey: ['user'],
        queryFn: () => getUser(),
        staleTime: 300_000,
        enabled: isAuthenticated,
        retry: false,
      },
      {
        queryKey: ['isAuthFollowingUser', username],
        queryFn: () => isAuthFollowingUser(username),
        staleTime: 300_000,
        enabled: isAuthenticated && !!username,
        retry: false,
      },
    ],
  });

  const { data: authUser } = authUserQuery;

  const { openToast, ...toastProps } = useToast();

  const queryClient = useQueryClient();

  const favoriteMutation = useFavoriteMutation({
    queryClient,
    authUser,
    openToast,
  });

  const unfavoriteMutation = useUnfavoriteMutation({
    queryClient,
    authUser,
    openToast,
  });

  const handleFavorite = async (
    route: UsernameAndSlug,
    isFavorited: boolean
  ) => {
    if (isFavorited) {
      unfavoriteMutation.mutate(route);
    } else {
      favoriteMutation.mutate(route);
    }
  };

  const followMutation = useFollowMutation({
    queryClient,
    authUser,
    openToast,
  });

  const unfollowMutation = useUnfollowMutation({
    queryClient,
    authUser,
    openToast,
  });

  const handleFollow = async (
    user: Pick<User, 'username'>,
    isFollowing: boolean
  ) => {
    if (isFollowing) {
      unfollowMutation.mutate(user);
    } else {
      followMutation.mutate(user);
    }
  };

  const handleShallowPush = (tab?: TabValue) => {
    shallowPush(
      router,
      `/${username}${
        tab && tab !== 'routes' ? `?${queryString.stringify({ tab })}` : ``
      }`
    );
  };

  if (userQuery.isLoading) {
    return (
      <Feedback
        size='full-header-crumbs-title-tabs-subtitle'
        type='loading'
        title='Loading your profile'
      />
    );
  }
  if (userQuery.isError) {
    return (
      <Feedback
        size='full-header-crumbs-title-tabs-subtitle'
        type='error'
        title='Something went wrong'
      >
        {userQuery.error instanceof Error
          ? userQuery.error.message
          : isAuthFollowingUserQuery.error instanceof Error
          ? isAuthFollowingUserQuery.error.message
          : null}
      </Feedback>
    );
  }
  if (userQuery.isSuccess) {
    const { data: user } = userQuery;

    const {
      name,
      bio,
      company,
      location,
      created_at,
      image_thumb_360,
      image_thumb_120,
      stats_following,
      stats_followers,
    } = user;

    const firstName = name?.split(' ')[0];
    const lastName = name?.split(' ')[1];

    const isFollowing = !!isAuthFollowingUserQuery.data;

    const authIsNotUser =
      authUser?.username && username && authUser.username !== username;

    return (
      <>
        <SEO
          title={`@${username} - Profile`}
          description={`View ${name}'s profile and routes.`}
        />
        <Toast {...toastProps} />
        <DefaultLayout.Main>
          <PageHeading
            breadcrumbs={[
              {
                id: username,
                children: username,
              },
            ]}
            actions={
              authIsNotUser
                ? [
                    {
                      id: 'follow-unfollow',
                      actionType: 'responsive-button',
                      variant: isFollowing ? 'outline' : 'solid',
                      size: 'md',
                      disabled:
                        followMutation.isLoading ||
                        unfollowMutation.isLoading ||
                        typeof isFollowing === null,
                      onClick: () => handleFollow({ username }, isFollowing),
                      children: (
                        <>
                          {isFollowing ? <BiCheck /> : <BiUser />}
                          <span>{isFollowing ? `Following` : `Follow`}</span>
                        </>
                      ),
                    },
                  ]
                : []
            }
          >
            {name}
          </PageHeading>
          <DefaultLayout.MainContent paddingY='none'>
            <MainContentBody>
              <div>
                <ResponsiveAvatar>
                  <Avatar
                    size='xl'
                    priority
                    src={image_thumb_120 || undefined}
                    firstName={firstName}
                    lastName={lastName}
                  />
                  <Avatar
                    size='2xl'
                    priority
                    src={image_thumb_120 || undefined}
                    firstName={firstName}
                    lastName={lastName}
                  />
                  <Avatar
                    size='3xl'
                    priority
                    src={image_thumb_360 || undefined}
                    firstName={firstName}
                    lastName={lastName}
                  />
                </ResponsiveAvatar>
                <Flex direction='column' gap='sm' alignItems='flex-start'>
                  <p>@{username}</p>
                  {!!bio && <p>{bio}</p>}
                  <div>
                    <Flex gap='xs' alignItems='center'>
                      <Button
                        variant='ghost'
                        size='xs'
                        onClick={() => {
                          handleShallowPush('followers');
                        }}
                      >
                        {stats_followers || 0} follower
                        {stats_followers !== 1 ? 's' : ''}
                      </Button>
                      <RxDotFilled />
                      <Button
                        variant='ghost'
                        size='xs'
                        onClick={() => {
                          handleShallowPush('following');
                        }}
                      >
                        {stats_following || 0} following
                      </Button>
                    </Flex>
                  </div>
                  {!!company && <p>{company}</p>}
                  {!!location && <p>{location}</p>}
                  {!!created_at && (
                    <p>Joined {dayjs(created_at).format('MMMM YYYY')}</p>
                  )}
                </Flex>
              </div>
              <Separator width='xs' height='full' colorScale={100} />
              <Tabs
                aria-label='Select profile tab'
                contentMinHeight='calc(100vh - 222px)'
                tabs={[
                  {
                    value: 'routes',
                    label: 'Routes',
                    children: (
                      <RoutesTab
                        isAuthenticated={isAuthenticated}
                        authUser={authUser}
                        username={username}
                        handleFavorite={handleFavorite}
                      />
                    ),
                  },
                  {
                    value: 'followers',
                    label: 'Followers',
                    children: (
                      <FollowersTab
                        isAuthenticated={isAuthenticated}
                        authUser={authUser}
                        username={username}
                        handleFollow={handleFollow}
                      />
                    ),
                  },
                  {
                    value: 'following',
                    label: 'Following',
                    children: (
                      <FollowingTab
                        isAuthenticated={isAuthenticated}
                        authUser={authUser}
                        username={username}
                        handleFollow={handleFollow}
                      />
                    ),
                  },
                  {
                    value: 'favorites',
                    label: 'Favorites',
                    children: (
                      <FavoritesTab
                        isAuthenticated={isAuthenticated}
                        authUser={authUser}
                        username={username}
                        handleFavorite={handleFavorite}
                      />
                    ),
                  },
                ]}
                defaultValue='routes'
                value={tab || 'routes'}
                onValueChange={(value: string) => {
                  handleShallowPush(value as unknown as TabValue);
                }}
                css={{
                  maxWidth: 'calc(100vw - $8)',
                  paddingTop: '$4',
                }}
              />
            </MainContentBody>
          </DefaultLayout.MainContent>
        </DefaultLayout.Main>
      </>
    );
  }
  return null;
};

const MainContentBody = styled('div', {
  position: 'relative',
  display: 'grid',
  alignItems: 'start',
  '& > div:first-child': {
    display: 'flex',
    flexDirection: 'column',
    gap: '$4',
    paddingTop: '$4',
  },
  '@md': {
    gridTemplateColumns: '$48 auto 1fr',
    gap: '$4',
    '& > div:first-child': {
      position: 'sticky',
      top: '$14',
    },
  },
  '@lg': {
    gridTemplateColumns: '$64 auto 1fr',
  },
});

const ResponsiveAvatar = styled('div', {
  width: '$24',
  '& > *:nth-child(1)': {
    display: 'block',
    visibility: 'visible',
  },
  '& > *:nth-child(2)': {
    display: 'none',
    visibility: 'hidden',
  },
  '& > *:nth-child(3)': {
    display: 'none',
    visibility: 'hidden',
  },
  '@md': {
    width: '$full',
    '& > *:nth-child(1)': {
      display: 'none',
      visibility: 'hidden',
    },
    '& > *:nth-child(2)': {
      display: 'block',
      visibility: 'visible',
    },
  },
  '@lg': {
    '& > *:nth-child(2)': {
      display: 'none',
      visibility: 'hidden',
    },
    '& > *:nth-child(3)': {
      display: 'block',
      visibility: 'visible',
    },
  },
});

Profile.getLayout = (page: ReactNode) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default Profile;

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
}) => {
  const username = getQueryParam(query, 'username');
  const tab = getQueryParam(query, 'tab');

  let user: User;

  try {
    user = await getUserByUsernameGSSP(username);

    if (!user) throw new Error(`User does not exist`);
  } catch (error) {
    return {
      notFound: true,
    };
  }

  const queryClient = new QueryClient();

  queryClient.setQueryData(['users', username], user);

  const session = await unstable_getServerSession(req, res, authOptions);

  const authUserId = await getUserIdGSSP(session);

  if (authUserId) {
    await queryClient.prefetchQuery(['user'], () =>
      getUserOrThrowGSSP(session)
    );
    await queryClient.prefetchQuery(['isAuthFollowingUser', username], () =>
      isAuthFollowingUserGSSP(authUserId, username)
    );

    if (['followers', 'following'].includes(tab)) {
      await queryClient.prefetchQuery(['followingIds'], () =>
        getFollowingIdsGSSP(authUserId)
      );
    } else {
      await queryClient.prefetchQuery(['favoritesIds'], () =>
        getFavoritesIdsGSSP(authUserId)
      );
    }
  }

  if (tab === 'followers') {
    await queryClient.prefetchQuery(
      ['followers', username, `size-${QUERY_SIZE}-page-1`],
      () => getFollowersByUsernameGSSP(username, { size: QUERY_SIZE })
    );
  } else if (tab === 'following') {
    await queryClient.prefetchQuery(
      ['following', username, `size-${QUERY_SIZE}-page-1`],
      () => getFollowingByUsernameGSSP(username, { size: QUERY_SIZE })
    );
  } else if (tab === 'favorites') {
    await queryClient.prefetchQuery(
      ['favorites', username, `size-${QUERY_SIZE}-page-1`],
      () => getFavoritesByUsernameGSSP(username, { size: QUERY_SIZE })
    );
  } else {
    // auth user id is optional
    await queryClient.prefetchQuery(
      ['routes', username, `size-${QUERY_SIZE}-page-1`],
      () =>
        getRoutesByUsernameGSSP(authUserId, username, {
          size: QUERY_SIZE,
        })
    );
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      isAuthenticated: !!authUserId,
    },
  };
};

type RoutesTabProps = {
  isAuthenticated: boolean;
  authUser?: User;
  username: User['username'];
  handleFavorite: (route: UsernameAndSlug, isFavorited: boolean) => void;
};

const RoutesTab: FC<RoutesTabProps> = ({
  isAuthenticated,
  authUser,
  username,
  handleFavorite,
}) => {
  const [routesQuery, favoriteIdsQuery] = useQueries({
    queries: [
      {
        queryKey: ['routes', username, `size-${QUERY_SIZE}-page-1`],
        queryFn: (): Promise<PaginatedRoutes> =>
          getRoutesByUsername(username, { size: QUERY_SIZE }),
        staleTime: 300_000,
        enabled: !!username,
      },
      {
        queryKey: ['favoritesIds'],
        queryFn: () => getFavoritesIds(),
        staleTime: 300_000,
        enabled: isAuthenticated,
        retry: false,
      },
    ],
  });

  const renderResult = () => {
    if (routesQuery.isLoading) {
      return <Feedback size='lg' type='loading' title='Loading routes' />;
    }
    if (routesQuery.isError) {
      return (
        <Feedback size='lg' type='error' title='Something went wrong'>
          {routesQuery.error instanceof Error
            ? routesQuery.error.message
            : null}
        </Feedback>
      );
    }
    if (routesQuery.isSuccess) {
      const { records: routes } = routesQuery.data;

      if (!Array.isArray(routes) || !routes.length) {
        return (
          <Feedback size='lg' type='empty' icon={BiMap} title='No Routes'>
            {authUser?.username && authUser.username === username
              ? `You haven't created a route.`
              : `@${username} hasn't created a public route.`}
          </Feedback>
        );
      }

      const { data: favoritesIds = [] } = favoriteIdsQuery;

      const isAuthenticated = !!authUser?.username;
      const authIsUser = isAuthenticated && authUser.username === username;

      return (
        <Grid gap='md'>
          {routes.map(
            ({
              id,
              owner,
              is_private,
              image_thumb_120,
              slug,
              title,
              stats_favorites,
            }) => {
              const isFavorited = favoritesIds?.includes(id) || false;

              return (
                <RouteCard
                  key={id}
                  orientation='horizontal'
                  image={image_thumb_120}
                  is_private={is_private}
                  username={owner?.username}
                  slug={slug}
                  title={title}
                  stats_favorites={stats_favorites}
                  showFavoriteBtn={isAuthenticated && !authIsUser}
                  isFavorited={isFavorited}
                  handleFavorite={() => {
                    handleFavorite(
                      { username: owner?.username, slug },
                      isFavorited
                    );
                  }}
                />
              );
            }
          )}
        </Grid>
      );
    }
    return null;
  };

  return (
    <ProfileTab>
      <div>
        <h2>Routes</h2>
        <Link
          aria-label={`View all @${username}'s routes`}
          href={`/${username}/routes`}
        >
          View All
        </Link>
      </div>
      {renderResult()}
    </ProfileTab>
  );
};

type FollowersTabProps = {
  isAuthenticated: boolean;
  authUser?: User;
  username: User['username'];
  handleFollow: (user: Pick<User, 'username'>, isFollowing: boolean) => void;
};

const FollowersTab: FC<FollowersTabProps> = ({
  isAuthenticated,
  authUser,
  username,
  handleFollow,
}) => {
  const [followersQuery, followingIdsQuery] = useQueries({
    queries: [
      {
        queryKey: ['followers', username, `size-${QUERY_SIZE}-page-1`],
        queryFn: (): Promise<PaginatedFollowers> =>
          getFollowersByUsername(username, {
            size: QUERY_SIZE,
          }),
        staleTime: 300_000,
        enabled: !!username,
      },
      {
        queryKey: ['followingIds'],
        queryFn: () => getFollowingIds(),
        staleTime: 300_000,
        enabled: isAuthenticated,
        retry: false,
      },
    ],
  });

  const renderResult = () => {
    if (followersQuery.isLoading) {
      return <Feedback size='lg' type='loading' title='Loading followers' />;
    }
    if (followersQuery.isError) {
      return (
        <Feedback size='lg' type='error' title='Something went wrong'>
          {followersQuery.error instanceof Error
            ? followersQuery.error.message
            : null}
        </Feedback>
      );
    }
    if (followersQuery.isSuccess) {
      const {
        data: { records: followers },
      } = followersQuery;

      if (!Array.isArray(followers) || !followers.length) {
        return (
          <Feedback size='lg' type='empty' icon={BiUser} title='No Followers'>
            <p>
              {authUser?.username && authUser.username === username
                ? `You don't have any followers.`
                : `@${username} doesn't have any followers.`}
            </p>
            {authUser?.username && authUser.username !== username && (
              <Button
                onClick={() => {
                  handleFollow({ username }, false);
                }}
              >
                Follow Them
              </Button>
            )}
          </Feedback>
        );
      }

      const { data: followingIds } = followingIdsQuery;

      return (
        <FollowersList
          followers={followers}
          authUser={authUser}
          followingIds={followingIds}
          handleFollow={handleFollow}
          cardOrientation='horizontal'
        />
      );
    }
    return null;
  };

  return (
    <ProfileTab>
      <div>
        <h2>Followers</h2>
        <Link
          aria-label={`View all @${username}'s followers`}
          href={`/${username}/followers`}
        >
          View All
        </Link>
      </div>
      {renderResult()}
    </ProfileTab>
  );
};

type FollowingTabProps = {
  isAuthenticated: boolean;
  authUser?: User;
  username: User['username'];
  handleFollow: (user: Pick<User, 'username'>, isFollowing: boolean) => void;
};

const FollowingTab: FC<FollowingTabProps> = ({
  isAuthenticated,
  authUser,
  username,
  handleFollow,
}) => {
  const [followingQuery, followingIdsQuery] = useQueries({
    queries: [
      {
        queryKey: ['following', username, `size-${QUERY_SIZE}-page-1`],
        queryFn: (): Promise<PaginatedFollowing> =>
          getFollowingByUsername(username, {
            size: QUERY_SIZE,
          }),
        staleTime: 300_000,
        enabled: !!username,
      },
      {
        queryKey: ['followingIds'],
        queryFn: () => getFollowingIds(),
        staleTime: 300_000,
        enabled: isAuthenticated,
        retry: false,
      },
    ],
  });

  const renderResult = () => {
    if (followingQuery.isLoading) {
      return <Feedback size='lg' type='loading' title='Loading following' />;
    }
    if (followingQuery.isError) {
      return (
        <Feedback size='lg' type='error' title='Something went wrong'>
          {followingQuery.error instanceof Error
            ? followingQuery.error.message
            : null}
        </Feedback>
      );
    }
    if (followingQuery.isSuccess) {
      const {
        data: { records: following },
      } = followingQuery;

      if (!Array.isArray(following) || !following.length) {
        return (
          <Feedback
            size='xl'
            type='empty'
            icon={BiUser}
            title='Not Following Anyone'
          >
            {authUser?.username && authUser.username === username
              ? `You aren't following anyone.`
              : `@${username} isn't following anyone.`}
          </Feedback>
        );
      }

      const { data: followingIds } = followingIdsQuery;

      return (
        <FollowingList
          following={following}
          authUser={authUser}
          followingIds={followingIds}
          handleFollow={handleFollow}
          cardOrientation='horizontal'
        />
      );
    }
    return null;
  };

  return (
    <ProfileTab>
      <div>
        <h2>Following</h2>
        <Link
          aria-label={`View all users @${username}'s follows`}
          href={`/${username}/following`}
        >
          View All
        </Link>
      </div>
      {renderResult()}
    </ProfileTab>
  );
};

type FavoritesTabProps = {
  isAuthenticated: boolean;
  authUser?: User;
  username: User['username'];
  handleFavorite: (route: UsernameAndSlug, isFavorited: boolean) => void;
};

const FavoritesTab: FC<FavoritesTabProps> = ({
  isAuthenticated,
  authUser,
  username,
  handleFavorite,
}) => {
  const [favoritesQuery, favoriteIdsQuery] = useQueries({
    queries: [
      {
        queryKey: ['favorites', username, `size-${QUERY_SIZE}-page-1`],
        queryFn: (): Promise<PaginatedFavorites> =>
          getFavoritesByUsername(username, { size: QUERY_SIZE }),
        staleTime: 300_000,
        enabled: !!username,
      },
      {
        queryKey: ['favoritesIds'],
        queryFn: () => getFavoritesIds(),
        staleTime: 300_000,
        enabled: isAuthenticated,
        retry: false,
      },
    ],
  });

  const renderResult = () => {
    if (favoritesQuery.isLoading) {
      return <Feedback size='lg' type='loading' title='Loading routes' />;
    }
    if (favoritesQuery.isError) {
      return (
        <Feedback size='lg' type='error' title='Something went wrong'>
          {favoritesQuery.error instanceof Error
            ? favoritesQuery.error.message
            : null}
        </Feedback>
      );
    }
    if (favoritesQuery.isSuccess) {
      const {
        data: { records: favorites },
      } = favoritesQuery;

      if (!Array.isArray(favorites) || !favorites.length) {
        return (
          <Feedback size='lg' type='empty' icon={BiStar} title='No Favorites'>
            {authUser?.username && authUser.username === username
              ? `You haven't starred any routes.`
              : `@${username} hasn't starred any routes.`}
          </Feedback>
        );
      }

      const { data: favoritesIds = [] } = favoriteIdsQuery;

      return (
        <FavoritesList
          favorites={favorites}
          authUser={authUser}
          favoritesIds={favoritesIds}
          handleFavorite={handleFavorite}
          cardOrientation='horizontal'
        />
      );
    }
    return null;
  };

  return (
    <ProfileTab>
      <div>
        <h2>Favorites</h2>
        <Link
          aria-label={`View all @${username}'s starred routes`}
          href={`/${username}/favorites`}
        >
          View All
        </Link>
      </div>
      {renderResult()}
    </ProfileTab>
  );
};

const ProfileTab = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$3',
  marginY: '$3',
  '& > div:first-child': {
    display: 'flex',
    alignItems: 'baseline',
    gap: '$3',
  },
});
