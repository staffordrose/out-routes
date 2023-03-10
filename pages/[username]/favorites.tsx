import { ReactNode } from 'react';
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
import { BiStar } from 'react-icons/bi';

import { Button, Flex, Toast, useToast } from '@/components/atoms';
import { DefaultLayout, Feedback, PageHeading } from '@/components/layout';
import { SEO } from '@/components/utility';
import { FavoritesList } from '@/features/users';
import { useQueryParam } from '@/hooks';
import { getFavoritesIds, getUser } from '@/lib/v1/api/user';
import { getFavoritesByUsername, getUserByUsername } from '@/lib/v1/api/users';
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
  getFavoritesByUsername as getFavoritesByUsernameGSSP,
  getUserByUsername as getUserByUsernameGSSP,
} from '@/lib/v1/users';
import { PaginatedFavorites } from '@/types/favorites';
import { UsernameAndSlug } from '@/types/routes';
import { User } from '@/types/users';
import { getQueryParam, shallowPush } from '@/utils';
import { authOptions } from '../api/auth/[...nextauth]';

const QUERY_SIZE = 12;

type FavoritesProps = {
  isAuthenticated: boolean;
};

const Favorites = ({ isAuthenticated }: FavoritesProps) => {
  const router = useRouter();

  const username = useQueryParam(router.query, 'username');
  const page = useQueryParam(router.query, 'page');

  const [userQuery, favoritesQuery, authUserQuery, favoritesIdsQuery] =
    useQueries({
      queries: [
        {
          queryKey: ['users', username],
          queryFn: () => getUserByUsername(username),
          staleTime: 300_000,
          enabled: !!username,
        },
        {
          queryKey: [
            'favorites',
            username,
            `size-${QUERY_SIZE}-page-${Number(page) || 1}`,
          ],
          queryFn: (): Promise<PaginatedFavorites> =>
            getFavoritesByUsername(username, {
              size: QUERY_SIZE,
              after:
                (Number(page) || 1) > 1
                  ? favoritesQuery?.data?.meta?.page?.cursor
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

  if (userQuery.isLoading || favoritesQuery.isLoading) {
    return <Feedback size='xl' type='loading' title='Loading favorites' />;
  }
  if (userQuery.isError || favoritesQuery.isError) {
    return (
      <Feedback size='xl' type='error' title='Something went wrong'>
        {userQuery.error instanceof Error
          ? userQuery.error.message
          : favoritesQuery.error instanceof Error
          ? favoritesQuery.error.message
          : null}
      </Feedback>
    );
  }
  if (userQuery.isSuccess && favoritesQuery.isSuccess) {
    const {
      data: { meta, records: favorites },
      isPreviousData,
    } = favoritesQuery;

    const { data: user } = userQuery;

    const { data: favoritesIds = [] } = favoritesIdsQuery;

    const pageNum = Number(page) || 1;
    const hasMore = !!meta?.page?.more;

    return (
      <>
        <SEO
          title={`@${username} - Starred Routes`}
          description={user.bio || `View all ${user.name}'s starred routes.`}
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
          >
            Favorites
          </PageHeading>
          <DefaultLayout.MainContent>
            {!Array.isArray(favorites) || !favorites.length ? (
              <Feedback
                size='lg'
                type='empty'
                icon={BiStar}
                title='No Favorites'
              >
                {authUser?.username && authUser.username === username
                  ? `You haven't starred any routes.`
                  : `@${username} hasn't starred any routes.`}
              </Feedback>
            ) : (
              <>
                <FavoritesList
                  favorites={favorites}
                  authUser={authUser}
                  favoritesIds={favoritesIds}
                  handleFavorite={handleFavorite}
                  columns={4}
                  cardOrientation='vertical'
                />
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
                          `/${username}/favorites${
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
                          `/${username}/favorites?${queryString.stringify({
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
              </>
            )}
          </DefaultLayout.MainContent>
        </DefaultLayout.Main>
      </>
    );
  }
  return null;
};

Favorites.getLayout = (page: ReactNode) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default Favorites;

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

  await queryClient.prefetchQuery(
    ['favorites', username, `size-${QUERY_SIZE}-page-1`],
    () =>
      getFavoritesByUsernameGSSP(username, {
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
