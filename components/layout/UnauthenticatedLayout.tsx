import { FC, ReactNode } from 'react';

import { Container, UnauthenticatedHeader } from '../layout';
import { styled } from '@/styles';

export type UnauthenticatedLayoutProps = {
  children: ReactNode;
};

type UnauthenticatedLayoutComponent = FC<UnauthenticatedLayoutProps> & {
  Main: FC<MainProps>;
};

export const UnauthenticatedLayout: UnauthenticatedLayoutComponent = ({
  children,
}) => {
  return (
    <>
      <UnauthenticatedHeader />
      <Container>{children}</Container>
    </>
  );
};

type MainProps = {
  children: ReactNode;
};

const Main: FC<MainProps> = (props) => {
  return <StyledMain {...props} />;
};

const StyledMain = styled('main', {
  width: '$full',
  maxWidth: '$container_xl',
  minHeight: 'calc(100vh - $14)',
  marginX: '$auto',
  paddingX: '$4',
});

UnauthenticatedLayout.Main = Main;
