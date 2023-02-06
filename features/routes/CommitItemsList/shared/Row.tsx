import { FC, ReactNode } from 'react';

import { Flex, Text } from '@/components/atoms';

type RowProps = {
  name: string;
  children: ReactNode;
};

export const Row: FC<RowProps> = ({ name, children }) => {
  return (
    <Flex gap='xs'>
      <Text as='span' fontWeight='medium'>
        {name}:
      </Text>
      {children}
    </Flex>
  );
};
