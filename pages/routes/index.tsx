import { ReactNode } from 'react';
import type { GetServerSideProps } from 'next/types';
import { useRouter } from 'next/router';
import { unstable_getServerSession } from 'next-auth';
import { QueryClient, dehydrate, useQueries } from '@tanstack/react-query';
import queryString from 'query-string';
import { BiMap, BiPlus } from 'react-icons/bi';

import { Button, Flex, Grid } from '@/components/atoms';
import { DefaultLayout, Feedback, PageHeading } from '@/components/layout';
import { SEO } from '@/components/utility';
import { RouteCard } from '@/features/routes';
import { useQueryParam } from '@/hooks';
import { getRoutesByUsername } from '@/lib/v1/api/users';
import { getUserOrThrow as getUserOrThrowGSSP } from '@/lib/v1/user';
import { getRoutesByUsername as getRoutesByUsernameGSSP } from '@/lib/v1/users';
import { PaginatedRoutes, User } from '@/types';
import { shallowPush } from '@/utils';
import { authOptions } from '../api/auth/[...nextauth]';

const QUERY_SIZE = 12;

type RoutesProps = {
  authUsername: User['username'] | null;
};

const Routes = ({ authUsername }: RoutesProps) => {
  const router = useRouter();

  const page = useQueryParam(router.query, 'page');

  const [routesQuery] = useQueries({
    queries: [
      {
        queryKey: [
          'routes',
          authUsername,
          `size-${QUERY_SIZE}-page-${Number(page) || 1}`,
        ],
        queryFn: (): Promise<PaginatedRoutes> =>
          getRoutesByUsername(authUsername, {
            size: QUERY_SIZE,
            after:
              (Number(page) || 1) > 1
                ? routesQuery?.data?.meta?.page?.cursor
                : undefined,
          }),
        keepPreviousData: true,
        staleTime: 300_000,
        enabled: !!authUsername,
      },
    ],
  });

  if (routesQuery.isLoading) {
    return <Feedback size='xl' type='loading' title='Loading routes' />;
  }
  if (routesQuery.isError) {
    return (
      <Feedback size='xl' type='error' title='Something went wrong'>
        {routesQuery.error instanceof Error ? routesQuery.error.message : null}
      </Feedback>
    );
  }
  if (routesQuery.isSuccess) {
    const {
      data: { meta, records: routes },
      isPreviousData,
    } = routesQuery;

    if (!Array.isArray(routes) || !routes.length) {
      return (
        <Feedback size='lg' type='empty' icon={BiMap} title='No Routes'>
          You haven&apos;t created a route.
        </Feedback>
      );
    }

    const pageNum = Number(page) || 1;
    const hasMore = !!meta?.page?.more;

    return (
      <>
        <SEO isNoIndex title='Your Routes' />
        <DefaultLayout.Main>
          <PageHeading
            actions={[
              {
                id: 'add-route',
                actionType: 'responsive-link',
                size: 'md',
                [`aria-label`]: 'Add a new route',
                href: '/routes/add',
                children: (
                  <>
                    <BiPlus />
                    <span>Add a Route</span>
                  </>
                ),
              },
            ]}
          >
            Your Routes
          </PageHeading>
          <Grid columns={4} gap='lg' marginBottom='lg'>
            {routes.map(
              ({
                id,
                owner,
                is_private,
                slug,
                title,
                image_card_banner,
                stats_favorites,
              }) => {
                return (
                  <RouteCard
                    key={id}
                    orientation='vertical'
                    image={image_card_banner}
                    username={owner?.username}
                    slug={slug}
                    is_private={is_private}
                    title={title}
                    stats_favorites={stats_favorites}
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
                    `/routes${
                      pageNum > 2
                        ? `?${queryString.stringify({ page: pageNum - 1 })}`
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
                    `/routes?${queryString.stringify({
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

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  let authUser: User | null = null;

  try {
    const session = await unstable_getServerSession(req, res, authOptions);

    if (!session) throw new Error(`You are not signed in`);

    authUser = await getUserOrThrowGSSP(session);
  } catch (error) {
    return {
      redirect: {
        destination: `/account/sign-in?${queryString.stringify({
          callbackUrl: `/routes`,
        })}`,
        permanent: false,
      },
    };
  }

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(
    ['routes', authUser?.username, `size-${QUERY_SIZE}-page-1`],
    () =>
      getRoutesByUsernameGSSP(authUser?.id as User['id'], authUser?.username, {
        size: QUERY_SIZE,
      })
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      authUsername: authUser?.username || null,
    },
  };
};
