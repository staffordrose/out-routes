import { ReactNode } from 'react';
import type { GetServerSideProps } from 'next/types';
import { useRouter } from 'next/router';
import { unstable_getServerSession } from 'next-auth';
import queryString from 'query-string';
import {
  QueryClient,
  dehydrate,
  useQueries,
  useQueryClient,
} from '@tanstack/react-query';
import { BiMap, BiPlus } from 'react-icons/bi';

import { Button, Flex, Grid, Toast, useToast } from '@/components/atoms';
import { DefaultLayout, Feedback, PageHeading } from '@/components/layout';
import { SEO } from '@/components/utility';
import { RouteCard } from '@/features/routes';
import { useQueryParam } from '@/hooks';
import { getFavoritesIds, getUser } from '@/lib/v1/api/user';
import { getUserByUsername, getRoutesByUsername } from '@/lib/v1/api/users';
import {
  useFavoriteMutation,
  useUnfavoriteMutation,
} from '@/lib/v1/hooks/user';
import {
  getFavoritesIds as getFavoritesIdsGSSP,
  getUserId as getUserIdGSSP,
  getUserOrThrow as getUserOrThrowGSSP,
} from '@/lib/v1/user';
import {
  getRoutesByUsername as getRoutesByUsernameGSSP,
  getUserByUsername as getUserByUsernameGSSP,
} from '@/lib/v1/users';
import { PaginatedRoutes, UsernameAndSlug } from '@/types/routes';
import { User } from '@/types/users';
import { getQueryParam, shallowPush } from '@/utils';
import { authOptions } from '../api/auth/[...nextauth]';

const QUERY_SIZE = 12;

type RoutesProps = {
  isAuthenticated: boolean;
};

const Routes = ({ isAuthenticated }: RoutesProps) => {
  const router = useRouter();

  const username = useQueryParam(router.query, 'username');
  const page = useQueryParam(router.query, 'page');

  const [userQuery, routesQuery, authUserQuery, favoriteIdsQuery] = useQueries({
    queries: [
      {
        queryKey: ['users', username],
        queryFn: () => getUserByUsername(username),
        staleTime: 300_000,
        enabled: !!username,
      },
      {
        queryKey: [
          'routes',
          username,
          `size-${QUERY_SIZE}-page-${Number(page) || 1}`,
        ],
        queryFn: (): Promise<PaginatedRoutes> =>
          getRoutesByUsername(username, {
            size: QUERY_SIZE,
            after:
              (Number(page) || 1) > 1
                ? routesQuery?.data?.meta?.page?.cursor
                : undefined,
          }),
        keepPreviousData: true,
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
        queryKey: ['favoritesIds'],
        queryFn: () => getFavoritesIds(),
        staleTime: 300_000,
        enabled: isAuthenticated,
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

  if (userQuery.isLoading || routesQuery.isLoading) {
    return (
      <Feedback size='full-header' type='loading' title='Loading routes' />
    );
  }
  if (userQuery.isError || routesQuery.isError) {
    return (
      <Feedback size='full-header' type='error' title='Something went wrong'>
        {userQuery.error instanceof Error
          ? userQuery.error.message
          : routesQuery.error instanceof Error
          ? routesQuery.error.message
          : null}
      </Feedback>
    );
  }
  if (userQuery.isSuccess && routesQuery.isSuccess) {
    const { data: user } = userQuery;

    const {
      data: { meta, records: routes },
      isPreviousData,
    } = routesQuery;

    const pageNum = Number(page) || 1;
    const hasMore = !!meta?.page?.more;

    const { data: favoritesIds = [] } = favoriteIdsQuery;

    const isAuthenticated = !!authUser?.username;
    const authIsOwner = isAuthenticated && authUser.username === username;

    return (
      <>
        <SEO
          title={`@${username} - Routes`}
          description={user.bio || `View all ${user.name}'s routes.`}
        />
        <Toast {...toastProps} />
        <DefaultLayout.Main>
          <PageHeading
            breadcrumbs={[
              {
                id: username,
                href: `/${username}`,
                children: username,
              },
            ]}
            actions={
              authIsOwner
                ? [
                    {
                      id: 'add-route',
                      actionType: 'responsive-link',
                      size: 'md',
                      [`aria-label`]: 'Add a new route',
                      href: '/routes/add/settings',
                      children: (
                        <>
                          <BiPlus />
                          <span>Add a Route</span>
                        </>
                      ),
                    },
                  ]
                : []
            }
          >
            Routes
          </PageHeading>

          {!Array.isArray(routes) || !routes.length ? (
            <Feedback
              size='full-header-crumbs-title'
              type='empty'
              icon={BiMap}
              title='No Routes'
            >
              {authUser?.username && authUser.username === username
                ? `You haven't created a route.`
                : `@${username} hasn't created a public route.`}
            </Feedback>
          ) : (
            <DefaultLayout.MainContent>
              <Grid columns={4} gap='lg' marginBottom='lg'>
                {routes.map(
                  ({
                    id,
                    owner,
                    is_private,
                    slug,
                    title,
                    image_card_banner,
                    static_image_card_banner,
                    stats_favorites,
                  }) => {
                    const isFavorited = favoritesIds?.includes(id) || false;

                    return (
                      <RouteCard
                        key={id}
                        orientation='vertical'
                        image={image_card_banner || static_image_card_banner}
                        username={owner?.username}
                        slug={slug}
                        is_private={is_private}
                        title={title}
                        stats_favorites={stats_favorites}
                        showFavoriteBtn={isAuthenticated && !authIsOwner}
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
              {(pageNum !== 1 || hasMore) && (
                <Flex
                  gap='lg'
                  justifyContent='space-between'
                  alignItems='center'
                  marginBottom='lg'
                >
                  <Button
                    onClick={() => {
                      shallowPush(
                        router,
                        `/${username}/routes${
                          pageNum > 2
                            ? `?${queryString.stringify({
                                page: pageNum - 1,
                              })}`
                            : ``
                        }`
                      );
                    }}
                    disabled={pageNum === 1}
                  >
                    Previous Page
                  </Button>
                  <Button
                    onClick={() => {
                      shallowPush(
                        router,
                        `/${username}/routes?${queryString.stringify({
                          page: hasMore ? pageNum + 1 : pageNum,
                        })}`
                      );
                    }}
                    disabled={isPreviousData || !hasMore}
                  >
                    Next Page
                  </Button>
                </Flex>
              )}
            </DefaultLayout.MainContent>
          )}
        </DefaultLayout.Main>
      </>
    );
  }
  return null;
};

Routes.getLayout = (page: ReactNode) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default Routes;

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
}) => {
  const username = getQueryParam(query, 'username');

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
    await queryClient.prefetchQuery(['favoritesIds'], () =>
      getFavoritesIdsGSSP(authUserId)
    );
  }

  // authUserId is not required
  await queryClient.prefetchQuery(
    ['routes', username, `size-${QUERY_SIZE}-page-1`],
    () =>
      getRoutesByUsernameGSSP(authUserId, username, {
        size: QUERY_SIZE,
      })
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      isAuthenticated: !!authUserId,
    },
  };
};
