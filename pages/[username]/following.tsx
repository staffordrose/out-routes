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
import { BiUser } from 'react-icons/bi';

import { Button, Flex, Toast, useToast } from '@/components/atoms';
import { DefaultLayout, Feedback, PageHeading } from '@/components/layout';
import { SEO } from '@/components/utility';
import { FollowingList } from '@/features/users';
import { useQueryParam } from '@/hooks';
import { getFollowingIds, getUser } from '@/lib/v1/api/user';
import { getFollowingByUsername, getUserByUsername } from '@/lib/v1/api/users';
import { useFollowMutation, useUnfollowMutation } from '@/lib/v1/hooks/user';
import {
  getFollowingIds as getFollowingIdsGSSP,
  getUserId as getUserIdGSSP,
  getUserOrThrow as getUserOrThrowGSSP,
} from '@/lib/v1/user';
import {
  getFollowingByUsername as getFollowingByUsernameGSSP,
  getUserByUsername as getUserByUsernameGSSP,
} from '@/lib/v1/users';
import { PaginatedFollowing, User } from '@/types';
import { getQueryParam, shallowPush } from '@/utils';
import { authOptions } from '../api/auth/[...nextauth]';

const QUERY_SIZE = 12;

type FollowingProps = {
  isAuthenticated: boolean;
};

const Following = ({ isAuthenticated }: FollowingProps) => {
  const router = useRouter();

  const username = useQueryParam(router.query, 'username');
  const page = useQueryParam(router.query, 'page');

  const [userQuery, followingQuery, authUserQuery, followingIdsQuery] =
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
            'following',
            username,
            `size-${QUERY_SIZE}-page-${Number(page) || 1}`,
          ],
          queryFn: (): Promise<PaginatedFollowing> =>
            getFollowingByUsername(username, {
              size: QUERY_SIZE,
              after:
                (Number(page) || 1) > 1
                  ? followingQuery?.data?.meta?.page?.cursor
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
          queryKey: ['followingIds'],
          queryFn: () => getFollowingIds(),
          staleTime: 300_000,
          enabled: isAuthenticated,
          retry: false,
        },
      ],
    });

  const { data: authUser } = authUserQuery;

  const { openToast, ...toastProps } = useToast();

  const queryClient = useQueryClient();

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

  if (userQuery.isLoading || followingQuery.isLoading) {
    return <Feedback size='xl' type='loading' title='Loading following' />;
  }
  if (userQuery.isError || followingQuery.isError) {
    return (
      <Feedback size='xl' type='error' title='Something went wrong'>
        {userQuery.error instanceof Error
          ? userQuery.error.message
          : followingQuery.error instanceof Error
          ? followingQuery.error.message
          : null}
      </Feedback>
    );
  }
  if (userQuery.isSuccess && followingQuery.isSuccess) {
    const {
      data: { meta, records: following },
      isPreviousData,
    } = followingQuery;

    const { data: user } = userQuery;

    const { data: followingIds = [] } = followingIdsQuery;

    const pageNum = Number(page) || 1;
    const hasMore = !!meta?.page?.more;

    return (
      <>
        <SEO
          title={`@${username} - Following`}
          description={user.bio || `View all ${user.name}'s following.`}
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
            Following
          </PageHeading>
          <DefaultLayout.MainContent>
            {!Array.isArray(following) || !following.length ? (
              <Feedback
                size='lg'
                type='empty'
                icon={BiUser}
                title='Not Following Anyone'
              >
                {authUser?.username && authUser.username === username
                  ? `You aren't following anyone.`
                  : `@${username} isn't following anyone.`}
              </Feedback>
            ) : (
              <>
                <FollowingList
                  following={following}
                  authUser={authUser}
                  followingIds={followingIds}
                  handleFollow={handleFollow}
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
                          `/${username}/following${
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
                          `/${username}/following?${queryString.stringify({
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

Following.getLayout = (page: ReactNode) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default Following;

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
    await queryClient.prefetchQuery(['followingIds'], () =>
      getFollowingIdsGSSP(authUserId)
    );
  }

  await queryClient.prefetchQuery(
    ['following', username, `size-${QUERY_SIZE}-page-1`],
    () =>
      getFollowingByUsernameGSSP(username, {
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
