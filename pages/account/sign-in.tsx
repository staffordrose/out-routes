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
  Grid,
  Heading,
  Input,
  Separator,
} from '@/components/atoms';
import { UnauthenticatedLayout } from '@/components/layout';
import { SEO } from '@/components/utility';
import { styled } from '@/styles';

const providerOrder = ['google', 'github'];

type SignInProps = {
  providers: ClientSafeProvider[];
  csrfToken?: string;
};

const SignIn: NextPage<SignInProps> = ({ providers, csrfToken }) => {
  const router = useRouter();

  const isSignUp = router.query.type === 'create';

  return (
    <>
      <SEO isNoIndex title={isSignUp ? `Join Us` : `Sign In`} />
      <UnauthenticatedLayout>
        <UnauthenticatedLayout.Main>
          <UnauthenticatedLayout.MainContent>
            <MainContentBody>
              <Heading as='h1' lineHeight='xs'>
                Sign {isSignUp ? 'up' : 'in'}
              </Heading>
              <Separator width='full' height='xs' marginY='xs' />
              <Heading as='h2' lineHeight='xs'>
                with Google/GitHub
              </Heading>
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
                        onClick={() =>
                          signIn(provider.id, { callbackUrl: '/' })
                        }
                      >
                        <ProviderIcon provider={provider.id} />
                        <span>
                          Sign {isSignUp ? 'up' : 'in'} with {provider.name}
                        </span>
                      </Button>
                    );
                  })}
              </Center>
              <Separator width='full' height='xs' marginY='xs' />
              <Heading as='h2' lineHeight='xs'>
                or with a Magic Email link
              </Heading>
              <form method='post' action='/api/auth/signin/email'>
                <input
                  name='csrfToken'
                  type='hidden'
                  defaultValue={csrfToken}
                />
                <Grid columns={5} gap='sm' alignItems='center'>
                  <FullWidthInput
                    type='email'
                    id='email'
                    name='email'
                    placeholder='johndoe@gmail.com'
                  />
                  <Button size='md' type='submit'>
                    <BiMailSend />
                    <span>Sign {isSignUp ? 'up' : 'in'} with Email</span>
                  </Button>
                </Grid>
              </form>
            </MainContentBody>
          </UnauthenticatedLayout.MainContent>
        </UnauthenticatedLayout.Main>
      </UnauthenticatedLayout>
    </>
  );
};

const MainContentBody = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: 'lg',
  justifyContent: 'center',
  width: 'full',
  maxWidth: 640,
  minHeight: '$96',
  marginX: '$auto',
  marginY: 'calc(50vh - $14 - $48)',
  padding: '$4',
  borderWidth: '$1',
  borderStyle: 'solid',
  borderColor: '$slate-300',
  borderRadius: '$xl',
  textAlign: 'center',
});

const FullWidthInput = styled(Input, {
  width: '$full',
});

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
