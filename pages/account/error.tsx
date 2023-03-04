import { useRouter } from 'next/router';
import { BiErrorCircle } from 'react-icons/bi';

import { Flex, Icon } from '@/components/atoms';
import { UnauthenticatedLayout } from '@/components/layout';
import { SEO } from '@/components/utility';

enum Errors {
  Configuration = 'Configuration',
  AccessDenied = 'AccessDenied',
  Verification = 'Verification',
  Default = 'Default',
}

const errorLabels: Record<Errors, string> = {
  [Errors.Configuration]: 'Configuration',
  [Errors.AccessDenied]: 'Access Denied',
  [Errors.Verification]: 'Verification',
  [Errors.Default]: 'Unknown Error',
};

const errorDescriptions: Record<Errors, string> = {
  [Errors.Configuration]: `There is a problem with the server configuration. If this problem persists, please contact support.`,
  [Errors.AccessDenied]: `You do not have access to perform this action. If the problem persists, please contact support.`,
  [Errors.Verification]: `There was a problem verifying your request. Please try again. If the problem persists, please contact support.`,
  [Errors.Default]: `We do not know exactly what went wrong. Please try again. If the problem persists, please contact support.`,
};

const Error = () => {
  const router = useRouter();
  const { error } = router.query;

  const title = errorLabels[error as Errors] || errorLabels[Errors.Default];

  return (
    <>
      <SEO isNoIndex title={title} />
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
              <Icon as={BiErrorCircle} size='2xl' />
              <h1>{title}</h1>
              <p>{errorDescriptions[(error as Errors) || Errors.Default]}</p>
            </Flex>
          </UnauthenticatedLayout.MainContent>
        </UnauthenticatedLayout.Main>
      </UnauthenticatedLayout>
    </>
  );
};

export default Error;
