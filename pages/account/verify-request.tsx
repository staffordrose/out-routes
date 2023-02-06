import { BiMailSend } from 'react-icons/bi';

import { Flex, Icon } from '@/components/atoms';
import { UnauthenticatedLayout } from '@/components/layout';

const VerifyRequest = () => {
  return (
    <UnauthenticatedLayout>
      <UnauthenticatedLayout.Main>
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
          <Icon as={BiMailSend} size='4xl' />
          <h1>Please check your email</h1>
          <p>A sign in link has been sent to your email address.</p>
        </Flex>
      </UnauthenticatedLayout.Main>
    </UnauthenticatedLayout>
  );
};

export default VerifyRequest;
