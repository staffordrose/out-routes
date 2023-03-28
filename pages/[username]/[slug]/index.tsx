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
import { BiCheck, BiEdit, BiStar } from 'react-icons/bi';

import { ButtonLink, Separator, Toast, useToast } from '@/components/atoms';
import { DefaultLayout, Feedback, PageHeading } from '@/components/layout';
import { SEO } from '@/components/utility';
import { RouteDetailBanner, RouteDetails, RouteMap } from '@/features/routes';
import { useQueryParam } from '@/hooks';
import { getRouteByUsernameSlug } from '@/lib/v1/api/routes';
import { getUser, isAuthFavoritingRoute } from '@/lib/v1/api/user';
import {
  useFavoriteMutation,
  useUnfavoriteMutation,
} from '@/lib/v1/hooks/user';
import {
  getRouteByUsernameSlug as getRouteByUsernameSlugGSSP,
  getRouteContributorsByUsernameSlug as getRouteContributorsByUsernameSlugGSSP,
} from '@/lib/v1/routes';
import {
  getUserId as getUserIdGSSP,
  getUserOrThrow as getUserOrThrowGSSP,
  isAuthFavoritingRoute as isAuthFavoritingRouteGSSP,
  isAuthRouteMember as isAuthRouteMemberGSSP,
} from '@/lib/v1/user';
import { RouteLayersFeatures, UsernameAndSlug } from '@/types/routes';
import { getQueryParam } from '@/utils';
import { authOptions } from '../../api/auth/[...nextauth]';

const QUERY_SIZE = 20;

type RouteDetailProps = {
  isAuthenticated: boolean;
  isAuthorized: boolean;
};

const RouteDetail = ({ isAuthenticated, isAuthorized }: RouteDetailProps) => {
  const router = useRouter();

  const username = useQueryParam(router.query, 'username');
  const slug = useQueryParam(router.query, 'slug');

  const [routeQuery, authUserQuery, isAuthFavoritingRouteQuery] = useQueries({
    queries: [
      {
        queryKey: ['routes', username, slug],
        queryFn: () => getRouteByUsernameSlug(username, slug),
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
        queryKey: ['isAuthFavoritingRoute', username, slug],
        queryFn: () => isAuthFavoritingRoute(username, slug),
        staleTime: 300_000,
        enabled: isAuthenticated && !!username && !!slug,
        retry: false,
      },
    ],
  });

  const { data: authUser } = authUserQuery;

  const { openToast, ...toastProps } = useToast();

  const queryClient = useQueryClient();

  // favorite route
  const favoriteMutation = useFavoriteMutation({
    queryClient,
    authUser,
    openToast,
  });

  // unfavorite route
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

  if (!isAuthorized) {
    return (
      <Feedback
        size='full-header'
        type='error'
        title='You are not authorized to view this route'
      >
        <ButtonLink
          variant='solid'
          colorScheme='red'
          size='lg'
          href={`/${username}`}
        >
          View User Profile
        </ButtonLink>
      </Feedback>
    );
  }
  if (routeQuery.isLoading) {
    return <Feedback size='full-header' type='loading' title='Loading route' />;
  }
  if (routeQuery.isError) {
    return (
      <Feedback size='full-header' type='error' title='Something went wrong'>
        {routeQuery.error instanceof Error ? routeQuery.error.message : null}
      </Feedback>
    );
  }
  if (routeQuery.isSuccess) {
    const {
      data: { route, layers, features },
    } = routeQuery;

    const { owner, is_private, title, image_banner, stats_favorites } = route;

    const isFavorited = !!isAuthFavoritingRouteQuery.data;

    const isAuthenticated = !!authUser?.username;
    const authIsOwner = isAuthenticated && authUser.username === username;

    return (
      <>
        <SEO
          title={`${title}${owner?.username ? ` | ${owner.username}` : ``}`}
          description={`${title} route details and map.`}
        />
        <Toast {...toastProps} />
        <RouteDetailBanner src={image_banner || undefined} alt={title || ''} />
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
                children: slug,
              },
            ]}
            actions={
              authIsOwner
                ? [
                    {
                      id: 'edit-route',
                      actionType: 'responsive-link',
                      variant: 'solid',
                      colorScheme: 'orange',
                      size: 'md',
                      [`aria-label`]: 'Edit route',
                      href: `${router.asPath}/edit`,
                      children: (
                        <>
                          <BiEdit />
                          <span>Edit</span>
                        </>
                      ),
                    },
                  ]
                : isAuthenticated &&
                  typeof is_private === 'boolean' &&
                  !is_private
                ? [
                    {
                      id: 'favorite-unfavorite',
                      actionType: 'responsive-button',
                      variant: isFavorited ? 'outline' : 'solid',
                      size: 'md',
                      disabled:
                        favoriteMutation.isLoading ||
                        unfavoriteMutation.isLoading ||
                        typeof isFavorited === null,
                      onClick: () =>
                        handleFavorite({ username, slug }, isFavorited),
                      children: (
                        <>
                          {isFavorited ? <BiCheck /> : <BiStar />}
                          <span>{Number(stats_favorites) || 0}</span>{' '}
                          <span>
                            Star{Number(stats_favorites) !== 1 ? `s` : ``}
                          </span>
                        </>
                      ),
                    },
                  ]
                : []
            }
          >
            {title || '[Untitled route]'}
          </PageHeading>
          <DefaultLayout.MainContent maxWidth='2xl'>
            <RouteDetails username={username} route={route} />
            <Separator width='full' height='xs' marginY='lg' colorScale={100} />
            <RouteMap route={route} layers={layers} features={features} />
          </DefaultLayout.MainContent>
        </DefaultLayout.Main>
      </>
    );
  }
  return (
    <Feedback size='full-header' type='empty' title='Route does not exist'>
      <p>
        Please check the URL you entered:{' '}
        <code style={{ backgroundColor: 'orange' }}>{router.asPath}</code>
      </p>
    </Feedback>
  );
};

RouteDetail.getLayout = (page: ReactNode) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default RouteDetail;

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

  // only members can view route
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
        throw new Error(`You must be signed in to view this route`);
      }

      const isMember = await isAuthRouteMemberGSSP(authUserId, username, slug);

      if (!isMember) {
        throw new Error(`You must be added as a member to view this route`);
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
    await queryClient.prefetchQuery(
      ['isAuthFavoritingRoute', username, slug],
      () => isAuthFavoritingRouteGSSP(authUserId, username, slug)
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
