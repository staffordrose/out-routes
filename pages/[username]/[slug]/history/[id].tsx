import { ReactNode } from 'react';
import type { GetServerSideProps } from 'next/types';
import { useRouter } from 'next/router';
import { unstable_getServerSession } from 'next-auth';
import { QueryClient, dehydrate, useQueries } from '@tanstack/react-query';
import queryString from 'query-string';
import { BiUser } from 'react-icons/bi';

import { Box, ButtonLink } from '@/components/atoms';
import { DefaultLayout, Feedback, PageHeading } from '@/components/layout';
import { SEO } from '@/components/utility';
import { CommitItemsList } from '@/features/routes';
import { UserCard } from '@/features/users';
import { useQueryParam } from '@/hooks';
import {
  getRouteByUsernameSlug,
  getRouteCommitByUsernameSlugId,
} from '@/lib/v1/api/routes';
import {
  getRouteByUsernameSlug as getRouteByUsernameSlugGSSP,
  getRouteCommitById as getRouteCommitByIdGSSP,
} from '@/lib/v1/routes';
import {
  getUserId as getUserIdGSSP,
  getUserOrThrow as getUserOrThrowGSSP,
  isAuthRouteMember as isAuthRouteMemberGSSP,
} from '@/lib/v1/user';
import {
  CommitWithItems,
  CompareCommitItem,
  RouteLayersFeatures,
} from '@/types';
import { displayDate, getQueryParam } from '@/utils';
import { authOptions } from '../../../api/auth/[...nextauth]';

type RouteHistoryEntryProps = {
  isAuthorized: boolean;
};

const RouteHistoryEntry = ({ isAuthorized }: RouteHistoryEntryProps) => {
  const router = useRouter();

  const username = useQueryParam(router.query, 'username');
  const slug = useQueryParam(router.query, 'slug');
  const id = useQueryParam(router.query, 'id');

  const [routeQuery, commitQuery] = useQueries({
    queries: [
      {
        queryKey: ['routes', username, slug],
        queryFn: () => getRouteByUsernameSlug(username, slug),
        staleTime: 300_000,
        enabled: isAuthorized && !!username && !!slug,
      },
      {
        queryKey: ['commits', username, slug, id],
        queryFn: (): Promise<CommitWithItems> =>
          getRouteCommitByUsernameSlugId(username, slug, id),
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
  if (routeQuery.isLoading || commitQuery.isLoading) {
    return <Feedback size='xl' type='loading' title='Loading route history' />;
  }
  if (routeQuery.isError || commitQuery.isError) {
    return (
      <Feedback size='xl' type='error' title='Something went wrong'>
        {routeQuery.error instanceof Error
          ? routeQuery.error.message
          : commitQuery.error instanceof Error
          ? commitQuery.error.message
          : null}
      </Feedback>
    );
  }
  if (routeQuery.isSuccess && commitQuery.isSuccess) {
    const {
      data: { commit, items },
    } = commitQuery;

    const { title, user } = commit;

    const {
      data: { route },
    } = routeQuery;

    return (
      <>
        <SEO
          title={`${route.title} - ${title || `[Untitled History Entry]`}`}
          description={`View ${title || `[Untitled History Entry]`}.`}
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
                href: `/${username}/${slug}/history`,
                children: 'history',
              },
            ]}
          >
            {title || `[Untitled History Entry]`}
          </PageHeading>

          <div>
            <h2>Summary</h2>
            <Box
              marginBottom='xl'
              css={{
                padding: '$2',
                borderWidth: '$2',
                borderStyle: 'dashed',
                borderColor: '$slate-200',
                borderRadius: '$md',
              }}
            >
              <h3>Author</h3>
              {!!user?.id && (
                <UserCard
                  key={user.id}
                  orientation='horizontal'
                  image={user.image_thumb_64}
                  username={user.username}
                  name={user.name}
                  bio={user.bio}
                  stats_followers={user.stats_followers}
                  showFollowBtn={false}
                />
              )}
              <h3>Date</h3>
              <p>{displayDate(commit.created_at || '')}</p>
            </Box>
            <div>
              {!Array.isArray(items) || !items.length ? (
                <Feedback
                  size='lg'
                  type='empty'
                  icon={BiUser}
                  title='No History'
                >
                  {`No changes were made in this history entry.`}
                </Feedback>
              ) : (
                <CommitItemsList
                  items={items.map(
                    ({ id, action, payload, resource_id, resource_table }) => ({
                      id,
                      action: action as CompareCommitItem['action'],
                      payload: payload ? JSON.parse(payload) : {},
                      resource_id:
                        resource_id as CompareCommitItem['resource_id'],
                      resource_table:
                        resource_table as CompareCommitItem['resource_table'],
                    })
                  )}
                />
              )}
            </div>
          </div>
        </DefaultLayout.Main>
      </>
    );
  }
  return null;
};

RouteHistoryEntry.getLayout = (page: ReactNode) => {
  return <DefaultLayout footerGap='sm'>{page}</DefaultLayout>;
};

export default RouteHistoryEntry;

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
}) => {
  const username = getQueryParam(query, 'username');
  const slug = getQueryParam(query, 'slug');
  const id = getQueryParam(query, 'id');

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

  await queryClient.prefetchQuery(['commits', username, slug, id], () =>
    getRouteCommitByIdGSSP(id)
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      isAuthorized: true,
    },
  };
};
