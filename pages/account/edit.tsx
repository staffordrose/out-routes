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

import { Toast, useToast } from '@/components/atoms';
import { DefaultLayout, Feedback, PageHeading } from '@/components/layout';
import { ResponsiveButton } from '@/components/molecules';
import { SEO } from '@/components/utility';
import { UserForm, UserFormValues } from '@/features/user';
import { getUser } from '@/lib/v1/api/user';
import { useUpdateUserMutation } from '@/lib/v1/hooks/user';
import { getUserOrThrow as getUserOrThrowGSSP } from '@/lib/v1/user';
import { authOptions } from '../api/auth/[...nextauth]';
import { BiSave } from 'react-icons/bi';

const EditProfile = () => {
  const router = useRouter();

  const authUserQuery = useQuery({
    queryKey: ['user'],
    queryFn: () => getUser(),
    staleTime: 300_000,
    retry: false,
  });

  const { openToast, ...toastProps } = useToast();

  const queryClient = useQueryClient();

  const updateUserMutation = useUpdateUserMutation({
    router,
    queryClient,
    openToast,
  });

  const onSubmit = async (values: UserFormValues) => {
    updateUserMutation.mutate({
      name: values.name,
      bio: values.bio,
      company: values.company,
      location: values.location,
    });
  };

  const renderResult = () => {
    if (updateUserMutation.isLoading) {
      return (
        <Feedback
          size='full-header'
          type='loading'
          title='Updating your profile'
        />
      );
    }
    if (updateUserMutation.isError) {
      return (
        <Feedback
          size='full-header'
          type='error'
          title='Oops! Something went wrong'
        >
          {updateUserMutation.error instanceof Error
            ? updateUserMutation.error.message
            : null}
        </Feedback>
      );
    }
    if (updateUserMutation.isSuccess) {
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
                id: 'edit-profile',
                children: 'profile',
              },
            ]}
            actions={
              <ResponsiveButton
                type='submit'
                form='user-form'
                variant='solid'
                colorScheme='orange'
                size='md'
              >
                <BiSave />
                <span>Save</span>
              </ResponsiveButton>
            }
          >
            Edit Profile
          </PageHeading>
          <DefaultLayout.MainContent maxWidth='lg'>
            <UserForm user={authUser} onSubmit={onSubmit} />
          </DefaultLayout.MainContent>
        </>
      );
    }
    return null;
  };

  return (
    <>
      <SEO isNoIndex title='Edit Your Profile' />
      <Toast {...toastProps} />
      <DefaultLayout.Main>{renderResult()}</DefaultLayout.Main>
    </>
  );
};

EditProfile.getLayout = (page: ReactNode) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default EditProfile;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  let session: Session | null;

  try {
    session = await unstable_getServerSession(req, res, authOptions);

    if (!session) throw new Error(`You are not signed in`);
  } catch (error) {
    return {
      redirect: {
        destination: `/account/sign-in?${queryString.stringify({
          callbackUrl: `/account/edit`,
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
