import { ReactNode, useMemo, useState } from 'react';
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
import { BiGitCompare } from 'react-icons/bi';

import { ButtonLink, Dialog, Toast, useToast } from '@/components/atoms';
import { DefaultLayout, Feedback, PageHeading } from '@/components/layout';
import { ResponsiveButton } from '@/components/molecules';
import { SEO } from '@/components/utility';
import { MemberRoles, memberRoles } from '@/data/routes';
import {
  CommitRouteForm,
  CommitRouteFormValues,
  RouteForm,
} from '@/features/routes';
import { RouteFormResult } from '@/features/routes/RouteForm/helpers';
import { useQueryParam } from '@/hooks';
import { getRouteByUsernameSlug } from '@/lib/v1/api/routes';
import { useUpdateRouteMutation } from '@/lib/v1/hooks/routes';
import { getRouteByUsernameSlug as getRouteByUsernameSlugGSSP } from '@/lib/v1/routes';
import {
  getAuthRouteMemberRoleByUsernameSlug as getAuthRouteMemberRoleByUsernameSlugGSSP,
  getUserId as getUserIdGSSP,
} from '@/lib/v1/user';
import {
  PartialRouteLayersFeatures,
  RouteLayersFeatures,
} from '@/types/routes';
import { compareCommits, getQueryParam } from '@/utils';
import { authOptions } from '../../api/auth/[...nextauth]';

type EditRouteProps = {
  isAuthorized: boolean;
};

const EditRoute = ({ isAuthorized }: EditRouteProps) => {
  const router = useRouter();

  const username = useQueryParam(router.query, 'username');
  const slug = useQueryParam(router.query, 'slug');

  const [routeQuery] = useQueries({
    queries: [
      {
        queryKey: ['routes', username, slug],
        queryFn: () => getRouteByUsernameSlug(username, slug),
        staleTime: 300_000,
        enabled: isAuthorized && !!username && !!slug,
      },
    ],
  });

  const { openToast, ...toastProps } = useToast();

  const queryClient = useQueryClient();

  // update route
  const updateRouteMutation = useUpdateRouteMutation({
    router,
    queryClient,
    username,
    slug,
    openToast,
  });

  const [isDialogOpen, setDialogOpen] = useState(false);

  const [values, setValues] = useState<RouteFormResult | null>(null);

  const commitItems = useMemo(() => {
    if (routeQuery.data && values) {
      return compareCommits(
        routeQuery.data as PartialRouteLayersFeatures,
        values as PartialRouteLayersFeatures
      );
    } else {
      return [];
    }
  }, [routeQuery.data, values]);

  const onSubmitRouteForm = (values: RouteFormResult) => {
    setValues(values);
    setDialogOpen(true);
  };

  const onSubmitCommitRouteForm = async ({ title }: CommitRouteFormValues) => {
    if (values) {
      updateRouteMutation.mutate({
        commitTitle: title,
        values,
      });
      setDialogOpen(false);
    }
  };

  if (!isAuthorized) {
    return (
      <Feedback
        size='full-header'
        type='error'
        title='You are not authorized to edit this route'
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
  if (updateRouteMutation.isLoading) {
    return (
      <Feedback size='full-header' type='loading' title='Updating route' />
    );
  }
  if (updateRouteMutation.isError) {
    return (
      <Feedback
        size='full-header'
        type='error'
        title='Oops! Something went wrong'
      >
        {updateRouteMutation.error instanceof Error
          ? updateRouteMutation.error.message
          : null}
      </Feedback>
    );
  }
  if (updateRouteMutation.isSuccess) {
    return (
      <Feedback size='full-header' type='success' title='Success!'>
        Redirecting you to the route
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

    return (
      <>
        <SEO isNoIndex title={`Edit ${route?.title || `Route`}`} />
        <Toast {...toastProps} />
        <Dialog
          isOpen={isDialogOpen}
          setOpen={setDialogOpen}
          title='Review Changes'
          description={`Review and title (optional) your changes to the route.`}
          body={
            <CommitRouteForm
              commitItems={commitItems}
              onSubmit={onSubmitCommitRouteForm}
            />
          }
        />
        <DefaultLayout.Main>
          <PageHeading
            breadcrumbs={[
              {
                id: username || '',
                href: `/${username}`,
                children: username,
              },
              {
                id: slug || '',
                href: `/${username}/${slug}`,
                children: slug,
              },
            ]}
            actions={
              <ResponsiveButton
                type='submit'
                form='route-form'
                variant='solid'
                colorScheme='orange'
                size='md'
              >
                <BiGitCompare />
                <span>Review</span>
              </ResponsiveButton>
            }
          >
            Edit Route
          </PageHeading>
          <DefaultLayout.MainContent paddingX='none' paddingY='none'>
            <RouteForm
              route={route}
              layers={layers || []}
              features={features || []}
              onSubmit={onSubmitRouteForm}
            />
          </DefaultLayout.MainContent>
        </DefaultLayout.Main>
      </>
    );
  }
  return null;
};

EditRoute.getLayout = (page: ReactNode) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default EditRoute;

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
    data = await getRouteByUsernameSlugGSSP(username, slug);

    if (!data.route) throw new Error(`Route does not exist`);
  } catch (error) {
    return {
      notFound: true,
    };
  }

  // must be authenticated to edit route
  if (!session?.user?.email || !authUserId) {
    return {
      redirect: {
        destination: `/account/sign-in?${queryString.stringify({
          callbackUrl: `/${username}/${slug}/edit`,
        })}`,
        permanent: false,
      },
    };
  }

  // only members with at least contributor role can edit route
  if (typeof data.route.is_private !== 'boolean' || data.route.is_private) {
    try {
      const authRouteMemberRole =
        await getAuthRouteMemberRoleByUsernameSlugGSSP(
          authUserId,
          username,
          slug
        );

      if (
        ![
          memberRoles.admin,
          memberRoles.moderator,
          memberRoles.contributor,
        ].includes(authRouteMemberRole as MemberRoles)
      ) {
        throw new Error(
          `You must be a member and have editing priviledges to create a merge request`
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

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      isAuthorized: true,
    },
  };
};
