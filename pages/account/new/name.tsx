import type { GetServerSideProps } from 'next/types';
import { useRouter } from 'next/router';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import { unstable_getServerSession } from 'next-auth/next';
import { useQueryClient } from '@tanstack/react-query';
import queryString from 'query-string';

import { Flex, Toast, useToast } from '@/components/atoms';
import { Feedback, NewUserLayout } from '@/components/layout';
import { SEO } from '@/components/utility';
import { sitename } from '@/data/site';
import { UserNameForm, UserNameFormValues } from '@/features/user';
import { useQueryParam } from '@/hooks';
import { useSetNameMutation } from '@/lib/v1/hooks/user';
import { getUserPropertiesOrThrow as getUserPropertiesOrThrowGSSP } from '@/lib/v1/user';
import { authOptions } from '../../api/auth/[...nextauth]';

const NewUserName = () => {
  const router = useRouter();

  const callbackUrl = useQueryParam(router.query, 'callbackUrl');

  const { data: session, status } = useSession();

  const { openToast, ...toastProps } = useToast();

  const queryClient = useQueryClient();

  const setNameMutation = useSetNameMutation({
    router,
    queryClient,
    callbackUrl,
    openToast,
  });

  const onSubmit = async (values: UserNameFormValues) => {
    setNameMutation.mutate({
      name: values.name,
    });
  };

  const renderResult = () => {
    if (setNameMutation.isLoading) {
      return (
        <Feedback size='xl' type='loading' title='Updating your profile' />
      );
    }
    if (setNameMutation.isError) {
      return (
        <Feedback size='xl' type='error' title='Oops! Something went wrong'>
          {setNameMutation.error instanceof Error
            ? setNameMutation.error.message
            : null}
        </Feedback>
      );
    }
    if (setNameMutation.isSuccess) {
      return (
        <Feedback size='xl' type='success' title='Success!'>
          Redirecting
        </Feedback>
      );
    }
    if (status === 'loading') {
      return <Feedback size='xl' type='loading' title='Loading your profile' />;
    }
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
              '& > div': {
                width: '$full',
                maxWidth: '$64',
                textAlign: 'left',
              },
            }}
          >
            <h1>Complete your registration</h1>
            <h2>Enter your name</h2>
            <p>(Will be publicly visible)</p>
            <div>
              <UserNameForm
                user={{
                  name: session?.user?.name,
                }}
                onSubmit={onSubmit}
              />
            </div>
          </Flex>
        </NewUserLayout.Main>
      </NewUserLayout>
    );
  };

  return (
    <>
      <SEO isNoIndex title={`Welcome to ${sitename}!`} />
      <Toast {...toastProps} />
      {renderResult()}
    </>
  );
};

export default NewUserName;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  let session: Session | null;

  try {
    session = await unstable_getServerSession(req, res, authOptions);

    if (!session) throw new Error(`You are not signed in`);
  } catch (error) {
    return {
      redirect: {
        destination: `/account/sign-in?${queryString.stringify({
          callbackUrl: `/account/new/name`,
        })}`,
        permanent: false,
      },
    };
  }

  try {
    const authUser = await getUserPropertiesOrThrowGSSP(
      session,
      ['name'],
      `You must be signed in to set your name`
    );

    if (authUser?.name) throw new Error(`You already have name set`);
  } catch (error) {
    return {
      redirect: {
        destination: `/account`,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
