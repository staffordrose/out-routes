import type { GetServerSideProps } from 'next/types';
import { unstable_getServerSession } from 'next-auth';
import {
  dehydrate,
  QueryClient,
  QueryFunctionContext,
  useInfiniteQuery,
  useQueries,
} from '@tanstack/react-query';
import queryString from 'query-string';
import { BiMap, BiPlus } from 'react-icons/bi';

import {
  Box,
  ButtonLink,
  Flex,
  IconButtonLink,
  Link,
  List,
  TruncatedText,
} from '@/components/atoms';
import { Feedback, MultiColumnLayout } from '@/components/layout';
import { SEO } from '@/components/utility';
import { sitename } from '@/data/site';
import { MarketingContent } from '@/features/home';
import { ActivityFeed } from '@/features/user';
import { UserCard } from '@/features/users';
import { getRoutes } from '@/lib/v1/api/routes';
import { getActivityFeed } from '@/lib/v1/api/user';
import { getRoutesByUsername, getUsers } from '@/lib/v1/api/users';
import { getRoutes as getRoutesGSSP } from '@/lib/v1/routes';
import { getUser as getUserGSSP } from '@/lib/v1/user';
import {
  getRoutesByUsername as getRoutesByUsernameGSSP,
  getUsers as getUsersGSSP,
} from '@/lib/v1/users';
import { PaginatedActivity } from '@/types/activity';
import { PaginatedRoutes } from '@/types/routes';
import { PaginatedUsers, User } from '@/types/users';
import { authOptions } from './api/auth/[...nextauth]';

const QUERY_SIZE = 12;

type HomeProps = {
  isAuthenticated: boolean;
  authUsername: User['username'] | null;
};

const Home = ({ isAuthenticated, authUsername }: HomeProps) => {
  const [routesQuery, userRoutesQuery, newUsersQuery] = useQueries({
    queries: [
      {
        queryKey: ['routes', 'home'],
        queryFn: (): Promise<PaginatedRoutes> =>
          getRoutes({ size: QUERY_SIZE }),
        keepPreviousData: true,
        staleTime: 300_000,
        enabled: !isAuthenticated, // only request for unauthenticated users
      },
      {
        queryKey: ['routes', authUsername, `size-${QUERY_SIZE}-page-1`],
        queryFn: (): Promise<PaginatedRoutes> =>
          getRoutesByUsername(authUsername, {
            size: QUERY_SIZE,
          }),
        staleTime: 300_000,
        enabled: isAuthenticated && !!authUsername,
      },
      {
        queryKey: ['users', 'home'],
        queryFn: (): Promise<PaginatedUsers> => getUsers({ size: QUERY_SIZE }),
        keepPreviousData: true,
        staleTime: 300_000,
        enabled: isAuthenticated,
      },
    ],
  });

  const activityQuery = useInfiniteQuery({
    queryKey: ['activity'],
    queryFn: ({
      pageParam,
    }: QueryFunctionContext): Promise<PaginatedActivity> =>
      getActivityFeed({
        size: QUERY_SIZE,
        after: pageParam,
      }),
    staleTime: 60_000, // refresh every minute
    enabled: isAuthenticated,
    getNextPageParam: (lastPage: PaginatedActivity) =>
      (lastPage?.meta?.page?.more && lastPage.meta.page.cursor) || undefined,
    getPreviousPageParam: (firstPage: PaginatedActivity) =>
      firstPage?.meta?.page?.cursor,
  });

  const renderUserRoutesResult = () => {
    if (userRoutesQuery.isLoading) {
      return <Feedback type='loading' title='Loading routes' />;
    }
    if (userRoutesQuery.isError) {
      return (
        <Feedback type='error' title='Something went wrong'>
          {userRoutesQuery.error instanceof Error
            ? userRoutesQuery.error.message
            : null}
        </Feedback>
      );
    }
    if (userRoutesQuery.isSuccess) {
      const { records: routes } = userRoutesQuery.data;

      if (!Array.isArray(routes) || !routes.length) {
        return (
          <Feedback type='empty' icon={BiMap} title='No Routes'>
            You haven&apos;t created a route.
          </Feedback>
        );
      }

      return (
        <>
          <List as='ul' direction='column' gap='xs' width='full'>
            {routes.map(({ id, owner, slug, title }) => {
              return (
                <li key={id}>
                  <Link href={`/${owner?.username}/${slug}`}>
                    <TruncatedText>{title}</TruncatedText>
                  </Link>
                </li>
              );
            })}
          </List>
          {routes.length === QUERY_SIZE && (
            <ButtonLink size='xs' href='/routes'>
              View All
            </ButtonLink>
          )}
        </>
      );
    }
    return null;
  };

  const renderNewUsersResult = () => {
    if (newUsersQuery.isLoading) {
      return <Feedback type='loading' title='Loading users' />;
    }
    if (newUsersQuery.isError) {
      return (
        <Feedback type='error' title='Something went wrong'>
          {newUsersQuery.error instanceof Error
            ? newUsersQuery.error.message
            : null}
        </Feedback>
      );
    }
    if (newUsersQuery.isSuccess) {
      const { records: users } = newUsersQuery.data;

      if (!Array.isArray(users) || !users.length) {
        return (
          <Feedback type='empty' icon={BiMap} title='No Users'>
            There are no new users.
          </Feedback>
        );
      }

      return (
        <List as='ul' direction='column' gap='lg' width='full'>
          {users
            .filter((user) => user.username !== authUsername)
            .map(({ id, username, name, image_thumb_120, stats_followers }) => {
              return (
                <li key={id}>
                  <UserCard
                    orientation='vertical'
                    image={image_thumb_120}
                    name={name}
                    username={username}
                    stats_followers={stats_followers}
                  />
                </li>
              );
            })}
        </List>
      );
    }
    return null;
  };

  if (!isAuthenticated) {
    return (
      <>
        <SEO
          title={`Welcome to ${sitename}`}
          description='Build routes & share knowledge with fellow backcountry enthusiasts.'
        />
        <MarketingContent routes={routesQuery.data?.records} />
      </>
    );
  }

  const { data } = activityQuery;
  const { pages } = data || {};

  return (
    <>
      <SEO
        title={`Welcome to ${sitename}`}
        description='Build routes & share knowledge with fellow backcountry enthusiasts.'
      />
      <MultiColumnLayout>
        <MultiColumnLayout.Aside>
          <Flex
            direction='column'
            gap='md'
            alignItems='flex-start'
            width='full'
            css={{
              overflowY: 'auto',
              maxHeight: 'calc(100vh - $14)',
              paddingX: '$4',
              paddingBottom: '$4',
              whiteSpace: 'nowrap',
              MsOverflowStyle: 'none' /* Internet Explorer 10+ */,
              scrollbarWidth: 'none' /* Firefox */,
              '&::-webkit-scrollbar': {
                display: 'none' /* Safari and Chrome */,
              },
            }}
          >
            <Flex
              gap='xs'
              justifyContent='space-between'
              alignItems='center'
              width='full'
              css={{ height: '$16' }}
            >
              <h2>Your Routes</h2>
              <IconButtonLink
                variant='ghost'
                href='/routes/add/settings'
                aria-label='Add a route'
              >
                <BiPlus />
              </IconButtonLink>
            </Flex>
            {renderUserRoutesResult()}
          </Flex>
        </MultiColumnLayout.Aside>
        <MultiColumnLayout.Main>
          <Box
            width='full'
            css={{
              '& > h1': {
                paddingX: '$4',
                paddingY: '$2',
                borderBottomWidth: '$1',
                borderBottomStyle: 'solid',
                borderBottomColor: '$slate-200',
              },
            }}
          >
            <h1>Recent Activity</h1>
            {activityQuery.isError && (
              <Feedback size='xs' type='error' title='Something went wrong'>
                {activityQuery.error instanceof Error
                  ? activityQuery.error.message
                  : null}
              </Feedback>
            )}
            <ActivityFeed
              pages={pages}
              isLoading={activityQuery.isLoading}
              hasMore={activityQuery.hasNextPage}
              loadMore={() => activityQuery.fetchNextPage()}
            />
          </Box>
          <MultiColumnLayout.MainAside>
            <Flex
              direction='column'
              gap='md'
              width='full'
              alignItems='flex-start'
              css={{
                overflowY: 'auto',
                maxHeight: 'calc(100vh - $14)',
                paddingX: '$4',
                paddingBottom: '$4',
                whiteSpace: 'nowrap',
                MsOverflowStyle: 'none' /* Internet Explorer 10+ */,
                scrollbarWidth: 'none' /* Firefox */,
                '&::-webkit-scrollbar': {
                  display: 'none' /* Safari and Chrome */,
                },
              }}
            >
              <Flex
                justifyContent='flex-start'
                alignItems='center'
                width='full'
                css={{ height: '$16' }}
              >
                <h2>New Users</h2>
              </Flex>
              {renderNewUsersResult()}
            </Flex>
          </MultiColumnLayout.MainAside>
        </MultiColumnLayout.Main>
      </MultiColumnLayout>
    </>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await unstable_getServerSession(req, res, authOptions);

  const authUser = await getUserGSSP(session);

  if (authUser?.id && !authUser.username) {
    return {
      redirect: {
        destination: `/account/new/username?${queryString.stringify({
          callbackUrl: `/`,
        })}`,
        permanent: false,
      },
    };
  }

  const queryClient = new QueryClient();

  if (authUser?.id) {
    await queryClient.prefetchQuery(['users', 'home'], () =>
      getUsersGSSP({ size: QUERY_SIZE })
    );

    await queryClient.prefetchQuery(
      ['routes', authUser.username, `size-${QUERY_SIZE}-page-1`],
      () =>
        getRoutesByUsernameGSSP(authUser.id, authUser.username, {
          size: QUERY_SIZE,
        })
    );
  }

  await queryClient.prefetchQuery(['routes', 'home'], () =>
    getRoutesGSSP({ size: QUERY_SIZE })
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      isAuthenticated: !!authUser?.id,
      authUsername: authUser?.username || null,
    },
  };
};
