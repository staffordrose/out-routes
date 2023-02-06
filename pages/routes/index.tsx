import { ReactNode } from 'react';
import type { GetServerSideProps } from 'next/types';
import { unstable_getServerSession } from 'next-auth';
import queryString from 'query-string';

import { Link } from '@/components/atoms';
import { DefaultLayout, PageHeading } from '@/components/layout';
import { SEO } from '@/components/utility';
import { authOptions } from '../api/auth/[...nextauth]';

const Routes = () => {
  return (
    <>
      <SEO isNoIndex title='Your Routes' />
      <DefaultLayout.Main>
        <PageHeading>Your Routes</PageHeading>
        <Link href='/routes/add'>Add a Route</Link>
      </DefaultLayout.Main>
    </>
  );
};

Routes.getLayout = (page: ReactNode) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default Routes;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  try {
    const session = await unstable_getServerSession(req, res, authOptions);

    if (!session) throw new Error(`You are not signed in`);
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

  return {
    props: {},
  };
};
