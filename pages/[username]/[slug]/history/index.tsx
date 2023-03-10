import { ReactNode } from 'react';
import type { GetServerSideProps } from 'next/types';
import { useRouter } from 'next/router';
import { unstable_getServerSession } from 'next-auth';
import { QueryClient, dehydrate, useQueries } from '@tanstack/react-query';
import queryString from 'query-string';
import { BiUser } from 'react-icons/bi';

import { Button, ButtonLink, Flex } from '@/components/atoms';
import { DefaultLayout, Feedback, PageHeading } from '@/components/layout';
import { SEO } from '@/components/utility';
import { CommitCard } from '@/features/routes';
import { useQueryParam } from '@/hooks';
import {
  getRouteByUsernameSlug,
  getRouteCommitsByUsernameSlug,
} from '@/lib/v1/api/routes';
import {
  getRouteByUsernameSlug as getRouteByUsernameSlugGSSP,
  getRouteCommitsByUsernameSlug as getRouteCommitsByUsernameSlugGSSP,
} from '@/lib/v1/routes';
import {
  getUserId as getUserIdGSSP,
  getUserOrThrow as getUserOrThrowGSSP,
  isAuthRouteMember as isAuthRouteMemberGSSP,
} from '@/lib/v1/user';
import { PaginatedCommits } from '@/types/commits';
import { RouteLayersFeatures } from '@/types/routes';
import { getQueryParam, shallowPush } from '@/utils';
import { authOptions } from '../../../api/auth/[...nextauth]';

const QUERY_SIZE = 12;

type RouteHistoryProps = {
  isAuthorized: boolean;
};

const RouteHistory = ({ isAuthorized }: RouteHistoryProps) => {
  const router = useRouter();

  const username = useQueryParam(router.query, 'username');
  const slug = useQueryParam(router.query, 'slug');
  const page = useQueryParam(router.query, 'page');

  const [routeQuery, commitsQuery] = useQueries({
    queries: [
      {
        queryKey: ['routes', username, slug],
        queryFn: () => getRouteByUsernameSlug(username, slug),
        staleTime: 300_000,
        enabled: isAuthorized && !!username && !!slug,
      },
      {
        queryKey: [
          'commits',
          username,
          slug,
          `size-${QUERY_SIZE}-page-${Number(page) || 1}`,
        ],
        queryFn: (): Promise<PaginatedCommits> =>
          getRouteCommitsByUsernameSlug(username, slug, {
            size: QUERY_SIZE,
            after:
              (Number(page) || 1) > 1
                ? commitsQuery?.data?.meta?.page?.cursor
                : undefined,
          }),
        keepPreviousData: true,
        staleTime: 300_000,
        enabled: isAuthorized && !!username && !!slug,
      },
    ],
  });

  if (!isAuthorized) {
    return (
      <Feedback
        size='xl'
        type='error'
        title='You are not authorized to view this route or its history'
      >
        <ButtonLink variant='solid' size='lg' href={`/${username}`}>
          View User Profile
        </ButtonLink>
      </Feedback>
    );
  }
  if (routeQuery.isLoading || commitsQuery.isLoading) {
    return <Feedback size='xl' type='loading' title='Loading route history' />;
  }
  if (routeQuery.isError || commitsQuery.isError) {
    return (
      <Feedback size='xl' type='error' title='Something went wrong'>
        {routeQuery.error instanceof Error
          ? routeQuery.error.message
          : commitsQuery.error instanceof Error
          ? commitsQuery.error.message
          : null}
      </Feedback>
    );
  }
  if (routeQuery.isSuccess && commitsQuery.isSuccess) {
    const {
      data: { meta, records: commits },
      isPreviousData,
    } = commitsQuery;

    const {
      data: { route },
    } = routeQuery;

    const pageNum = Number(page) || 1;
    const hasMore = !!meta?.page?.more;

    return (
      <>
        <SEO
          title={`${route.title} - History`}
          description={`View change history for @${username}/${slug}.`}
        />
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
              {
                id: 'history',
                children: 'history',
              },
            ]}
          >
            History
          </PageHeading>
          <DefaultLayout.MainContent>
            {!Array.isArray(commits) || !commits.length ? (
              <Feedback size='lg' type='empty' icon={BiUser} title='No History'>
                {`@${username}/${slug} doesn't have any entries in its history.`}
              </Feedback>
            ) : (
              <>
                <Flex direction='column' gap='md' marginBottom='lg'>
                  {commits.map((commit) => {
                    return (
                      <CommitCard
                        key={commit.id}
                        orientation='horizontal'
                        username={username}
                        slug={slug}
                        id={commit.id}
                        created_at={commit.created_at}
                        title={commit.title}
                        user={commit.user}
                      />
                    );
                  })}
                </Flex>
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
                          `/${username}/${slug}/history${
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
                          `/${username}/${slug}/history?${queryString.stringify(
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
          </DefaultLayout.MainContent>
        </DefaultLayout.Main>
      </>
    );
  }
  return null;
};

RouteHistory.getLayout = (page: ReactNode) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default RouteHistory;

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

  // only members can view route history
  if (typeof data.route.is_private !== 'boolean' || data.route.is_private) {
    if (!session?.user?.email) {
      return {
        redirect: {
          destination: `/account/sign-in?${queryString.stringify({
            callbackUrl: `/${username}/${slug}`,
          })}`,
          permanent: false,
        },
      };
    }

    try {
      if (!authUserId) {
        throw new Error(`You must be signed in to view the route's history`);
      }

      const isMember = await isAuthRouteMemberGSSP(authUserId, username, slug);

      if (!isMember) {
        throw new Error(
          `You must be added as a member to view the route's history`
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
  }

  await queryClient.prefetchQuery(
    ['commits', username, slug, `size-${QUERY_SIZE}-page-1`],
    () =>
      getRouteCommitsByUsernameSlugGSSP(username, slug, {
        size: QUERY_SIZE,
      })
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      isAuthorized: true,
    },
  };
};
