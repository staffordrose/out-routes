import { BiMailSend } from 'react-icons/bi';

import { Flex, Icon } from '@/components/atoms';
import { UnauthenticatedLayout } from '@/components/layout';
import { SEO } from '@/components/utility';

const VerifyRequest = () => {
  return (
    <>
      <SEO isNoIndex title='Please Check Your Email' />
      <UnauthenticatedLayout>
        <UnauthenticatedLayout.Main>
          <UnauthenticatedLayout.MainContent>
            <Flex
              direction='column'
              gap='md'
              justifyContent='center'
              alignItems='center'
              width='full'
              css={{
                maxWidth: 640,
                minHeight: '$64',
                marginX: '$auto',
                marginY: 'calc(50vh - $14 - $32)',
                padding: '$4',
                borderWidth: '$1',
                borderStyle: 'solid',
                borderColor: '$slate-300',
                borderRadius: '$xl',
                textAlign: 'center',
              }}
            >
              <Icon as={BiMailSend} size='2xl' />
              <h1>Please check your email</h1>
              <p>A sign in link has been sent to your email address.</p>
            </Flex>
          </UnauthenticatedLayout.MainContent>
        </UnauthenticatedLayout.Main>
      </UnauthenticatedLayout>
    </>
  );
};

export default VerifyRequest;
