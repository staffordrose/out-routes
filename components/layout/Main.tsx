import { FC, ReactNode } from 'react';

import { styled } from '@/styles';

export type MainProps = {
  children: ReactNode;
};

export const Main: FC<MainProps> = (props) => {
  return <StyledMain {...props} />;
};

const StyledMain = styled('main', {
  width: '$full',
  maxWidth: '$container_xl',
  minHeight: 'calc(100vh - $14)',
  marginX: '$auto',
  paddingX: '$4',
});
