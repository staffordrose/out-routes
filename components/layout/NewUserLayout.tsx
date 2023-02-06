import { FC, ReactNode } from 'react';

import { Container, FauxHeader } from '../layout';
import { styled } from '@/styles';

type NewUserLayoutProps = {
  children: ReactNode;
};

type NewUserLayoutComponent = FC<NewUserLayoutProps> & {
  Main: FC<MainProps>;
};

export const NewUserLayout: NewUserLayoutComponent = ({ children }) => {
  return (
    <>
      <FauxHeader />
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

NewUserLayout.Main = Main;
