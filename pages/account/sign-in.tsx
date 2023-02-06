import { FC } from 'react';
import type { GetServerSideProps, NextPage } from 'next/types';
import { useRouter } from 'next/router';
import {
  getCsrfToken,
  getProviders,
  signIn,
  ClientSafeProvider,
} from 'next-auth/react';
import { BiMailSend } from 'react-icons/bi';
import { BsGithub, BsGoogle } from 'react-icons/bs';

import {
  Button,
  Center,
  Flex,
  Grid,
  Input,
  Separator,
} from '@/components/atoms';
import { PageHeading, UnauthenticatedLayout } from '@/components/layout';

const providerOrder = ['google', 'github'];

type SignInProps = {
  providers: ClientSafeProvider[];
  csrfToken?: string;
};

const SignIn: NextPage<SignInProps> = ({ providers, csrfToken }) => {
  const router = useRouter();

  const isSignUp = router.query.type === 'create';

  return (
    <UnauthenticatedLayout>
      <UnauthenticatedLayout.Main>
        <PageHeading>Sign {isSignUp ? 'Up' : 'In'}</PageHeading>
        <Flex
          direction='column'
          gap='lg'
          css={{
            width: '$full',
            maxWidth: 640,
            marginX: '$auto',
            marginY: '$32',
            padding: '$6',
            textAlign: 'center',
            backgroundColor: '$slate-50',
          }}
        >
          <h2>Sign {isSignUp ? 'up' : 'in'} with Google/GitHub</h2>
          <Center direction='column' gap='md'>
            {Object.values(providers)
              .filter((provider) => provider.id !== 'email')
              .sort(
                (a, b) =>
                  providerOrder.indexOf(a.id) - providerOrder.indexOf(b.id)
              )
              .map((provider) => {
                return (
                  <Button
                    key={provider.id}
                    variant='solid'
                    size='md'
                    onClick={() => signIn(provider.id)}
                  >
                    <ProviderIcon provider={provider.id} />
                    <span>
                      Sign {isSignUp ? 'up' : 'in'} with {provider.name}
                    </span>
                  </Button>
                );
              })}
          </Center>
          <Separator width='full' height='sm' marginY='sm' />
          <h2>or with a Magic Email link</h2>
          <form method='post' action='/api/auth/signin/email'>
            <input name='csrfToken' type='hidden' defaultValue={csrfToken} />
            <Grid columns={5} gap='sm' alignItems='center'>
              <Input
                type='email'
                id='email'
                name='email'
                placeholder='johndoe@gmail.com'
                css={{ width: '$full' }}
              />
              <Button size='md' type='submit'>
                <BiMailSend />
                <span>Sign {isSignUp ? 'up' : 'in'} with Email</span>
              </Button>
            </Grid>
          </form>
        </Flex>
      </UnauthenticatedLayout.Main>
    </UnauthenticatedLayout>
  );
};

export default SignIn;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const providers = await getProviders();
  const csrfToken = await getCsrfToken(ctx);

  return {
    props: { providers, csrfToken },
  };
};

type ProviderIconProps = {
  provider: ClientSafeProvider['id'];
};

const ProviderIcon: FC<ProviderIconProps> = ({ provider }) => {
  switch (provider) {
    case 'google':
      return <BsGoogle />;
    case 'github':
      return <BsGithub />;
    default:
      return null;
  }
};
