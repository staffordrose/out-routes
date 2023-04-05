import { ReactNode } from 'react';
import type { GetServerSideProps } from 'next/types';
import { useRouter } from 'next/router';
import { Session } from 'next-auth';
import { unstable_getServerSession } from 'next-auth/next';
import {
  QueryClient,
  dehydrate,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import queryString from 'query-string';
import { BiSave } from 'react-icons/bi';

import { List, Text, Toast, useToast } from '@/components/atoms';
import { DefaultLayout, Feedback, PageHeading } from '@/components/layout';
import { ResponsiveButton } from '@/components/molecules';
import { SEO } from '@/components/utility';
import { UserUsernameForm, UserUsernameFormValues } from '@/features/user';
import { getUser } from '@/lib/v1/api/user';
import { useChangeUsernameMutation } from '@/lib/v1/hooks/user';
import { getUserOrThrow as getUserOrThrowGSSP } from '@/lib/v1/user';
import { authOptions } from '../api/auth/[...nextauth]';

const EditUsername = () => {
  const router = useRouter();

  const authUserQuery = useQuery({
    queryKey: ['user'],
    queryFn: () => getUser(),
    staleTime: 300_000,
    retry: false,
  });

  const { openToast, ...toastProps } = useToast();

  const queryClient = useQueryClient();

  const changeUsernameMutation = useChangeUsernameMutation({
    router,
    queryClient,
    openToast,
  });

  const onSubmit = async (values: UserUsernameFormValues) => {
    changeUsernameMutation.mutate({
      username: values.username,
    });
  };

  const renderResult = () => {
    if (changeUsernameMutation.isLoading) {
      return (
        <Feedback
          size='full-header'
          type='loading'
          title='Updating your profile'
        />
      );
    }
    if (changeUsernameMutation.isError) {
      return (
        <Feedback
          size='full-header'
          type='error'
          title='Oops! Something went wrong'
        >
          {changeUsernameMutation.error instanceof Error
            ? changeUsernameMutation.error.message
            : null}
        </Feedback>
      );
    }
    if (changeUsernameMutation.isSuccess) {
      return (
        <Feedback size='full-header' type='success' title='Success!'>
          Redirecting you to your profile
        </Feedback>
      );
    }
    if (authUserQuery.isLoading) {
      return (
        <Feedback
          size='full-header'
          type='loading'
          title='Loading your profile'
        />
      );
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
      const { data: authUser } = authUserQuery;

      return (
        <>
          <PageHeading
            breadcrumbs={[
              {
                id: 'account',
                href: '/account',
                children: 'account',
              },
              {
                id: 'username',
                children: 'username',
              },
            ]}
            actions={
              <ResponsiveButton
                type='submit'
                form='user-username-form'
                variant='solid'
                colorScheme='orange'
                size='md'
              >
                <BiSave />
                <span>Save</span>
              </ResponsiveButton>
            }
          >
            Change Username
          </PageHeading>
          <DefaultLayout.MainContent maxWidth='sm'>
            <List as='ul' direction='column' marginBottom='xl'>
              <li>
                <p>This can only be changed once every 12 months!</p>
              </li>
              <li>
                <p>
                  Your current username is:{' '}
                  <Text as='span' fontWeight='bold'>
                    {authUser.username}
                  </Text>
                </p>
              </li>
            </List>
            <UserUsernameForm
              user={{ username: authUser.username }}
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
      <SEO isNoIndex title='Edit Your Username' />
      <Toast {...toastProps} />
      <DefaultLayout.Main>{renderResult()}</DefaultLayout.Main>
    </>
  );
};

EditUsername.getLayout = (page: ReactNode) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default EditUsername;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  let session: Session | null;

  try {
    session = await unstable_getServerSession(req, res, authOptions);

    if (!session) throw new Error(`You are not signed in`);
  } catch (error) {
    return {
      redirect: {
        destination: `/account/sign-in?${queryString.stringify({
          callbackUrl: `/account/username`,
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
