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
import { SEO } from '@/components/utility';
import { RouteForm } from '@/features/routes';
import { getUser } from '@/lib/v1/api/user';
import { useAddRouteMutation } from '@/lib/v1/hooks/routes';
import { getUserOrThrow as getUserOrThrowGSSP } from '@/lib/v1/user';
import { Route, RouteLayersFeatures } from '@/types';
import { authOptions } from '../api/auth/[...nextauth]';

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

  const onSubmit = async ({ route }: RouteLayersFeatures) => {
    addRouteMutation.mutate(route);
  };

  const renderResult = () => {
    if (addRouteMutation.isLoading) {
      return <Feedback size='xl' type='loading' title='Adding route' />;
    }
    if (addRouteMutation.isError) {
      return (
        <Feedback size='xl' type='error' title='Oops! Something went wrong'>
          {addRouteMutation.error instanceof Error
            ? addRouteMutation.error.message
            : null}
        </Feedback>
      );
    }
    if (addRouteMutation.isSuccess) {
      return (
        <Feedback size='xl' type='success' title='Success!'>
          Redirecting you to the route
        </Feedback>
      );
    }
    if (authUserQuery.isLoading) {
      return <Feedback size='xl' type='loading' title='Loading' />;
    }
    if (authUserQuery.isError) {
      return (
        <Feedback size='xl' type='error' title='Something went wrong'>
          {authUserQuery.error instanceof Error
            ? authUserQuery.error.message
            : null}
        </Feedback>
      );
    }
    if (authUserQuery.isSuccess) {
      return (
        <>
          <PageHeading
            breadcrumbs={[]}
            actions={[
              {
                id: 'save-route',
                actionType: 'responsive-button',
                type: 'submit',
                form: 'route-form',
                variant: 'solid',
                size: 'md',
                disabled: addRouteMutation.isLoading,
                children: (
                  <>
                    <BiSave />
                    <span>Save</span>
                  </>
                ),
              },
            ]}
          >
            Add Route
          </PageHeading>
          <RouteForm
            route={{} as Route}
            layers={[]}
            features={[]}
            onSubmit={onSubmit}
          />
        </>
      );
    }
    return null;
  };

  return (
    <>
      <SEO title='Add Route' isNoIndex />
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
          callbackUrl: `/routes/add`,
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
