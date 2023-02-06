import { FC, ReactNode } from 'react';

import { styled } from '@/styles';

export type ContainerProps = {
  children: ReactNode;
};

export const Container: FC<ContainerProps> = (props) => {
  return <StyledContainer {...props} />;
};

const StyledContainer = styled('div', {
  width: '$full',
  minHeight: 'calc(100vh - $14)',
  paddingTop: '$14',
});
