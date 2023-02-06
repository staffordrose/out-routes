import { useMemo } from 'react';
import type { GetServerSideProps } from 'next/types';
import { useRouter } from 'next/router';
import { Session } from 'next-auth';
import { unstable_getServerSession } from 'next-auth/next';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import queryString from 'query-string';

import { Flex, Toast, useToast } from '@/components/atoms';
import { Feedback, NewUserLayout } from '@/components/layout';
import { SEO } from '@/components/utility';
import { sitename } from '@/data/site';
import { UserUsernameForm, UserUsernameFormValues } from '@/features/user';
import { useQueryParam } from '@/hooks';
import { getUser } from '@/lib/v1/api/user';
import { useSetUsernameMutation } from '@/lib/v1/hooks/user';
import { getUserPropertiesOrThrow as getUserPropertiesOrThrowGSSP } from '@/lib/v1/user';
import { authOptions } from '../../api/auth/[...nextauth]';

const NewUserUsername = () => {
  const router = useRouter();

  const callbackUrl = useQueryParam(router.query, 'callbackUrl');

  const authUserQuery = useQuery({
    queryKey: ['user'],
    queryFn: () => getUser(),
    staleTime: 300_000,
    retry: false,
  });

  const { data: authUser } = authUserQuery;

  const hasName = useMemo<boolean>(() => !!authUser?.name, [authUser?.name]);

  const { openToast, ...toastProps } = useToast();

  const queryClient = useQueryClient();

  const setUsernameMutation = useSetUsernameMutation({
    router,
    queryClient,
    hasName,
    callbackUrl,
    openToast,
  });

  const onSubmit = async (values: UserUsernameFormValues) => {
    setUsernameMutation.mutate({
      username: values.username,
    });
  };

  const renderResult = () => {
    if (setUsernameMutation.isLoading) {
      return (
        <Feedback size='xl' type='loading' title='Updating your profile' />
      );
    }
    if (setUsernameMutation.isError) {
      return (
        <Feedback size='xl' type='error' title='Oops! Something went wrong'>
          {setUsernameMutation.error instanceof Error
            ? setUsernameMutation.error.message
            : null}
        </Feedback>
      );
    }
    if (setUsernameMutation.isSuccess) {
      return (
        <Feedback size='xl' type='success' title='Success!'>
          {hasName ? `Redirecting` : ``}
        </Feedback>
      );
    }
    if (authUserQuery.isLoading) {
      return <Feedback size='xl' type='loading' title='Loading your profile' />;
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
        <NewUserLayout>
          <NewUserLayout.Main>
            <Flex
              direction='column'
              gap='md'
              alignItems='center'
              css={{
                width: '$full',
                maxWidth: 640,
                marginX: '$auto',
                marginY: '$48',
                padding: '$6',
                borderWidth: '$2',
                borderStyle: 'dashed',
                borderColor: '$slate-200',
                textAlign: 'center',
              }}
            >
              <h1>Welcome to {sitename}!</h1>
              <h2>Select your username</h2>
              <p>(Will be publicly visible)</p>
              <UserUsernameForm user={{}} onSubmit={onSubmit} />
            </Flex>
          </NewUserLayout.Main>
        </NewUserLayout>
      );
    }
    return null;
  };

  return (
    <>
      <SEO isNoIndex title={`Welcome to ${sitename}!`} />
      <Toast {...toastProps} />
      {renderResult()}
    </>
  );
};

export default NewUserUsername;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  let session: Session | null;

  try {
    session = await unstable_getServerSession(req, res, authOptions);

    if (!session) throw new Error(`You are not signed in`);
  } catch (error) {
    return {
      redirect: {
        destination: `/account/sign-in?${queryString.stringify({
          callbackUrl: `/account/new/username`,
        })}`,
        permanent: false,
      },
    };
  }

  try {
    const authUser = await getUserPropertiesOrThrowGSSP(
      session,
      ['username'],
      `You must be signed in to set your username`
    );

    if (authUser?.username) throw new Error(`You already have username set`);
  } catch (error) {
    return {
      redirect: {
        destination: '/account/username',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
