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

import { Button, ButtonLink, Flex, Toast, useToast } from '@/components/atoms';
import { DefaultLayout, Feedback, PageHeading } from '@/components/layout';
import { SEO } from '@/components/utility';
import { ContributorsList } from '@/features/routes';
import { useQueryParam } from '@/hooks';
import {
  getRouteByUsernameSlug,
  getRouteContributorsByUsernameSlug,
} from '@/lib/v1/api/routes';
import { getFollowingIds, getUser } from '@/lib/v1/api/user';
import { useFollowMutation, useUnfollowMutation } from '@/lib/v1/hooks/user';
import {
  getRouteByUsernameSlug as getRouteByUsernameSlugGSSP,
  getRouteContributorsByUsernameSlug as getRouteContributorsByUsernameSlugGSSP,
} from '@/lib/v1/routes';
import {
  getFollowingIds as getFollowingIdsGSSP,
  getUserId as getUserIdGSSP,
  getUserOrThrow as getUserOrThrowGSSP,
  isAuthRouteMember as isAuthRouteMemberGSSP,
} from '@/lib/v1/user';
import { PaginatedContributors, RouteLayersFeatures, User } from '@/types';
import { getQueryParam, shallowPush } from '@/utils';
import { authOptions } from '../../api/auth/[...nextauth]';

const QUERY_SIZE = 12;

type RouteContributorsProps = {
  isAuthenticated: boolean;
  isAuthorized: boolean;
};

const RouteContributors = ({
  isAuthenticated,
  isAuthorized,
}: RouteContributorsProps) => {
  const router = useRouter();

  const username = useQueryParam(router.query, 'username');
  const slug = useQueryParam(router.query, 'slug');
  const page = useQueryParam(router.query, 'page');

  const [routeQuery, contributorsQuery, authUserQuery, followingIdsQuery] =
    useQueries({
      queries: [
        {
          queryKey: ['routes', username, slug],
          queryFn: () => getRouteByUsernameSlug(username, slug),
          staleTime: 300_000,
          enabled: isAuthorized && !!username && !!slug,
        },
        {
          queryKey: [
            'contributors',
            username,
            slug,
            `size-${QUERY_SIZE}-page-${Number(page) || 1}`,
          ],
          queryFn: (): Promise<PaginatedContributors> =>
            getRouteContributorsByUsernameSlug(username, slug, {
              size: QUERY_SIZE,
              after:
                (Number(page) || 1) > 1
                  ? contributorsQuery?.data?.meta?.page?.cursor
                  : undefined,
            }),
          keepPreviousData: true,
          staleTime: 300_000,
          enabled: isAuthorized && !!username && !!slug,
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

  if (!isAuthorized) {
    return (
      <Feedback
        size='xl'
        type='error'
        title='You are not authorized to view this route or its contributors'
      >
        <ButtonLink variant='solid' size='lg' href={`/${username}`}>
          View User Profile
        </ButtonLink>
      </Feedback>
    );
  }
  if (routeQuery.isLoading || contributorsQuery.isLoading) {
    return <Feedback size='xl' type='loading' title='Loading contributors' />;
  }
  if (routeQuery.isError || contributorsQuery.isError) {
    return (
      <Feedback size='xl' type='error' title='Something went wrong'>
        {routeQuery.error instanceof Error
          ? routeQuery.error.message
          : contributorsQuery.error instanceof Error
          ? contributorsQuery.error.message
          : null}
      </Feedback>
    );
  }
  if (routeQuery.isSuccess && contributorsQuery.isSuccess) {
    const {
      data: { meta, records: contributors },
      isPreviousData,
    } = contributorsQuery;

    const {
      data: { route },
    } = routeQuery;

    const { data: followingIds = [] } = followingIdsQuery;

    const pageNum = Number(page) || 1;
    const hasMore = !!meta?.page?.more;

    return (
      <>
        <SEO
          title={`${route.title} - Contributors`}
          description={`View all @${username}/${slug} contributors`}
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
              {
                id: slug,
                href: `/${username}/${slug}`,
                children: slug,
              },
            ]}
          >
            Contributors
          </PageHeading>
          {!Array.isArray(contributors) || !contributors.length ? (
            <Feedback
              size='lg'
              type='empty'
              icon={BiUser}
              title='No Contributors'
            >
              {`@${username}/${slug} doesn't have any contributors.`}
            </Feedback>
          ) : (
            <>
              <ContributorsList
                contributors={contributors}
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
                        `/${username}/${slug}/contributors${
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
                        `/${username}/${slug}/contributors?${queryString.stringify(
                          {
                            page: hasMore ? pageNum + 1 : pageNum,
                          }
                        )}`
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
        </DefaultLayout.Main>
      </>
    );
  }
  return null;
};

RouteContributors.getLayout = (page: ReactNode) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default RouteContributors;

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
}) => {
  const username = getQueryParam(query, 'username');
  const slug = getQueryParam(query, 'slug');

  const session = await unstable_getServerSession(req, res, authOptions);

  const authUserId = await getUserIdGSSP(session);

  let data: RouteLayersFeatures;

  try {
    // automatically throws error if route does not exist
    data = await getRouteByUsernameSlugGSSP(username, slug);
  } catch (error) {
    return {
      notFound: true,
    };
  }

  // only members can view route contributors
  if (typeof data.route.is_private !== 'boolean' || data.route.is_private) {
    if (!session?.user?.email) {
      return {
        redirect: {
          destination: `/account/sign-in?${queryString.stringify({
            callbackUrl: `/${username}/${slug}/contributors`,
          })}`,
          permanent: false,
        },
      };
    }

    try {
      if (!authUserId) {
        throw new Error(`You must be signed in to view the route contributors`);
      }

      const isMember = await isAuthRouteMemberGSSP(authUserId, username, slug);

      if (!isMember) {
        throw new Error(
          `You must be added as a member to view the route contributors`
        );
      }
    } catch (error) {
      return {
        props: {
          isAuthorized: false,
        },
      };
    }
  }

  const queryClient = new QueryClient();

  queryClient.setQueryData(['routes', username, slug], data);

  if (authUserId) {
    await queryClient.prefetchQuery(['user'], () =>
      getUserOrThrowGSSP(session)
    );
    await queryClient.prefetchQuery(['followingIds'], () =>
      getFollowingIdsGSSP(authUserId)
    );
  }

  await queryClient.prefetchQuery(
    ['contributors', username, slug, `size-${QUERY_SIZE}-page-1`],
    () =>
      getRouteContributorsByUsernameSlugGSSP(username, slug, {
        size: QUERY_SIZE,
      })
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      isAuthenticated: !!authUserId,
      isAuthorized: true,
    },
  };
};
