import { ReactNode } from 'react';
import type { GetServerSideProps } from 'next/types';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import { unstable_getServerSession } from 'next-auth/next';
import { QueryClient, dehydrate, useQuery } from '@tanstack/react-query';
import queryString from 'query-string';
import { BiExit } from 'react-icons/bi';

import { Toast, useToast } from '@/components/atoms';
import { DefaultLayout, Feedback, PageHeading } from '@/components/layout';
import { ResponsiveButton } from '@/components/molecules';
import { SEO } from '@/components/utility';
import { AccountDetails } from '@/features/user';
import { getUser } from '@/lib/v1/api/user';
import { getUserOrThrow as getUserOrThrowGSSP } from '@/lib/v1/user';
import { authOptions } from '../api/auth/[...nextauth]';

const Account = () => {
  const {
    data: user,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useQuery({
    queryKey: ['user'],
    queryFn: () => getUser(),
    staleTime: 300_000,
    retry: false,
  });

  const { openToast, ...toastProps } = useToast();

  const renderResult = () => {
    if (isLoading) {
      return (
        <Feedback size='full-header' type='loading' title='Loading account' />
      );
    }
    if (isError) {
      return (
        <Feedback size='full-header' type='error' title='Something went wrong'>
          {error instanceof Error ? error.message : null}
        </Feedback>
      );
    }
    if (isSuccess) {
      return (
        <>
          <PageHeading
            breadcrumbs={[
              {
                id: 'account',
                children: 'account',
              },
            ]}
            actions={
              <ResponsiveButton
                variant='solid'
                colorScheme='orange'
                size='md'
                onClick={() => signOut()}
              >
                <BiExit />
                <span>Sign Out</span>
              </ResponsiveButton>
            }
          >
            Account
          </PageHeading>
          <DefaultLayout.MainContent>
            <AccountDetails user={user} openToast={openToast} />
          </DefaultLayout.MainContent>
        </>
      );
    }
    return null;
  };

  return (
    <>
      <SEO isNoIndex title='Your Account' />
      <Toast {...toastProps} />
      <DefaultLayout.Main>{renderResult()}</DefaultLayout.Main>
    </>
  );
};

Account.getLayout = (page: ReactNode) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default Account;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  let session: Session | null;

  try {
    session = await unstable_getServerSession(req, res, authOptions);

    if (!session) throw new Error(`You are not signed in`);
  } catch (error) {
    return {
      redirect: {
        destination: `/account/sign-in?${queryString.stringify({
          callbackUrl: `/account`,
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
