import { ReactNode } from 'react';
import type { GetServerSideProps } from 'next/types';
import { useRouter } from 'next/router';
import { Session, unstable_getServerSession } from 'next-auth';
import queryString from 'query-string';
import {
  QueryClient,
  dehydrate,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { BiSave } from 'react-icons/bi';

import { Toast, useToast } from '@/components/atoms';
import { DefaultLayout, Feedback, PageHeading } from '@/components/layout';
import { ResponsiveButton } from '@/components/molecules';
import { SEO } from '@/components/utility';
import { RouteForm } from '@/features/routes';
import { RouteFormResult } from '@/features/routes/RouteForm/helpers';
import { getUser } from '@/lib/v1/api/user';
import { useAddRouteMutation } from '@/lib/v1/hooks/routes';
import { getUserOrThrow as getUserOrThrowGSSP } from '@/lib/v1/user';
import { Route } from '@/types/routes';
import { getQueryParam } from '@/utils';
import { authOptions } from '../../api/auth/[...nextauth]';

const AddRoute = () => {
  const router = useRouter();

  const authUserQuery = useQuery({
    queryKey: ['user'],
    queryFn: () => getUser(),
    staleTime: 300_000,
    retry: false,
  });

  const { data: authUser } = authUserQuery;

  const { openToast, ...toastProps } = useToast();

  const queryClient = useQueryClient();

  const addRouteMutation = useAddRouteMutation({
    router,
    queryClient,
    authUser,
    openToast,
  });

  const onSubmit = async (values: RouteFormResult) => {
    addRouteMutation.mutate(values);
  };

  const renderResult = () => {
    if (addRouteMutation.isLoading) {
      return (
        <Feedback size='full-header' type='loading' title='Adding route' />
      );
    }
    if (addRouteMutation.isError) {
      return (
        <Feedback
          size='full-header'
          type='error'
          title='Oops! Something went wrong'
        >
          {addRouteMutation.error instanceof Error
            ? addRouteMutation.error.message
            : null}
        </Feedback>
      );
    }
    if (addRouteMutation.isSuccess) {
      return (
        <Feedback size='full-header' type='success' title='Success!'>
          Redirecting you to the route
        </Feedback>
      );
    }
    if (authUserQuery.isLoading) {
      return <Feedback size='full-header' type='loading' title='Loading' />;
    }
    if (authUserQuery.isError) {
      return (
        <Feedback size='full-header' type='error' title='Something went wrong'>
          {authUserQuery.error instanceof Error
            ? authUserQuery.error.message
            : null}
        </Feedback>
      );
    }
    if (authUserQuery.isSuccess) {
      const is_private = getQueryParam(router.query, 'is_private');
      const title = getQueryParam(router.query, 'title');
      const activity_type = getQueryParam(router.query, 'activity_type');
      const region = getQueryParam(router.query, 'region');
      const country = getQueryParam(router.query, 'country');

      const { title_alt } = router.query;

      const partialRoute: Partial<Route> = {
        is_private: is_private === 'true' ? true : false,
        title: title || '',
        title_alt:
          Array.isArray(title_alt) && title_alt.length ? title_alt : [],
        activity_type: activity_type || '',
        region: region || '',
        country: country || '',
      };

      return (
        <>
          <PageHeading
            breadcrumbs={[
              {
                id: 'routes',
                href: `/routes`,
                children: 'routes',
              },
            ]}
            actions={
              <ResponsiveButton
                type='submit'
                form='route-form'
                variant='solid'
                colorScheme='orange'
                size='md'
                disabled={addRouteMutation.isLoading}
              >
                <BiSave />
                <span>Save</span>
              </ResponsiveButton>
            }
          >
            Add Route
          </PageHeading>
          <DefaultLayout.MainContent paddingX='none' paddingY='none'>
            <RouteForm
              route={partialRoute as Route}
              layers={[]}
              features={[]}
              onSubmit={onSubmit}
            />
          </DefaultLayout.MainContent>
        </>
      );
    }
    return null;
  };

  return (
    <>
      <SEO isNoIndex title='Add a Route' />
      <Toast {...toastProps} />
      <DefaultLayout.Main>{renderResult()}</DefaultLayout.Main>
    </>
  );
};

AddRoute.getLayout = (page: ReactNode) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default AddRoute;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  let session: Session | null;

  try {
    session = await unstable_getServerSession(req, res, authOptions);

    if (!session) throw new Error(`You are not signed in`);
  } catch (error) {
    return {
      redirect: {
        destination: `/account/sign-in?${queryString.stringify({
          callbackUrl: `/routes/add/settings`,
        })}`,
        permanent: false,
      },
    };
  }

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(['user'], () => getUserOrThrowGSSP(session));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};
