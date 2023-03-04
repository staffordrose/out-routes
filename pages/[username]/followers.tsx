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
import { FollowersList } from '@/features/users';
import { useQueryParam } from '@/hooks';
import { getFollowingIds, getUser } from '@/lib/v1/api/user';
import { getFollowersByUsername, getUserByUsername } from '@/lib/v1/api/users';
import { useFollowMutation, useUnfollowMutation } from '@/lib/v1/hooks/user';
import {
  getFollowingIds as getFollowingIdsGSSP,
  getUserId as getUserIdGSSP,
  getUserOrThrow as getUserOrThrowGSSP,
} from '@/lib/v1/user';
import {
  getFollowersByUsername as getFollowersByUsernameGSSP,
  getUserByUsername as getUserByUsernameGSSP,
} from '@/lib/v1/users';
import { PaginatedFollowers, User } from '@/types';
import { getQueryParam, shallowPush } from '@/utils';
import { authOptions } from '../api/auth/[...nextauth]';

const QUERY_SIZE = 12;

type FollowersProps = {
  isAuthenticated: boolean;
};

const Followers = ({ isAuthenticated }: FollowersProps) => {
  const router = useRouter();

  const username = useQueryParam(router.query, 'username');
  const page = useQueryParam(router.query, 'page');

  const [userQuery, followersQuery, authUserQuery, followingIdsQuery] =
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
            'followers',
            username,
            `size-${QUERY_SIZE}-page-${Number(page) || 1}`,
          ],
          queryFn: (): Promise<PaginatedFollowers> =>
            getFollowersByUsername(username, {
              size: QUERY_SIZE,
              after:
                (Number(page) || 1) > 1
                  ? followersQuery?.data?.meta?.page?.cursor
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

  if (userQuery.isLoading || followersQuery.isLoading) {
    return <Feedback size='xl' type='loading' title='Loading followers' />;
  }
  if (userQuery.isError || followersQuery.isError) {
    return (
      <Feedback size='xl' type='error' title='Something went wrong'>
        {userQuery.error instanceof Error
          ? userQuery.error.message
          : followersQuery.error instanceof Error
          ? followersQuery.error.message
          : null}
      </Feedback>
    );
  }
  if (userQuery.isSuccess && followersQuery.isSuccess) {
    const {
      data: { meta, records: followers },
      isPreviousData,
    } = followersQuery;

    const { data: user } = userQuery;

    const { data: followingIds = [] } = followingIdsQuery;

    const pageNum = Number(page) || 1;
    const hasMore = !!meta?.page?.more;

    return (
      <>
        <SEO
          title={`@${username} - Followers`}
          description={user.bio || `View all ${user.name}'s followers.`}
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
            Followers
          </PageHeading>
          <DefaultLayout.MainContent>
            {!Array.isArray(followers) || !followers.length ? (
              <Feedback
                size='lg'
                type='empty'
                icon={BiUser}
                title='No Followers'
              >
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
            ) : (
              <>
                <FollowersList
                  followers={followers}
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
                          `/${username}/followers${
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
                          `/${username}/followers?${queryString.stringify({
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

Followers.getLayout = (page: ReactNode) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default Followers;

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
    ['followers', username, `size-${QUERY_SIZE}-page-1`],
    () =>
      getFollowersByUsernameGSSP(username, {
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
