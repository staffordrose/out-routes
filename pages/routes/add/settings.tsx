import { ReactNode } from 'react';
import type { GetServerSideProps } from 'next/types';
import { useRouter } from 'next/router';
import { Session, unstable_getServerSession } from 'next-auth';
import queryString from 'query-string';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { BiMapAlt } from 'react-icons/bi';

import { DefaultLayout, PageHeading } from '@/components/layout';
import { SEO } from '@/components/utility';
import { RouteSettingsForm } from '@/features/routes';
import { getUserOrThrow as getUserOrThrowGSSP } from '@/lib/v1/user';
import { Route } from '@/types/routes';
import { authOptions } from '../../api/auth/[...nextauth]';

const AddRouteSettings = () => {
  const router = useRouter();

  const onSubmit = async (values: Partial<Route>) => {
    router.push(`/routes/add?${queryString.stringify(values)}`);
  };

  return (
    <>
      <SEO isNoIndex title='Add a Route' />
      <DefaultLayout.Main>
        <PageHeading
          breadcrumbs={[
            {
              id: 'routes',
              href: `/routes`,
              children: 'routes',
            },
          ]}
          actions={[
            {
              id: 'save-route-settings',
              actionType: 'responsive-button',
              type: 'submit',
              form: 'route-settings-form',
              variant: 'solid',
              colorScheme: 'orange',
              size: 'md',
              children: (
                <>
                  <BiMapAlt />
                  <span>Continue to Map</span>
                </>
              ),
            },
          ]}
        >
          Add Route
        </PageHeading>
        <DefaultLayout.MainContent paddingX='none' paddingY='none'>
          <RouteSettingsForm onSubmit={onSubmit} />
        </DefaultLayout.MainContent>
      </DefaultLayout.Main>
    </>
  );
};

AddRouteSettings.getLayout = (page: ReactNode) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default AddRouteSettings;

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
