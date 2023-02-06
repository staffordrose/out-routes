import { useRouter } from 'next/router';

import { Flex } from '@/components/atoms';
import { UnauthenticatedLayout } from '@/components/layout';

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
          <h1>{errorLabels[(error as Errors) || Errors.Default]}</h1>
          <p>{errorDescriptions[(error as Errors) || Errors.Default]}</p>
        </Flex>
      </UnauthenticatedLayout.Main>
    </UnauthenticatedLayout>
  );
};

export default Error;
