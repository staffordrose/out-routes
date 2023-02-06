import { FC, ReactNode } from 'react';

import { Container, Footer, FooterProps, Header } from '../layout';
import { styled } from '@/styles';

type DefaultLayoutProps = {
  footerGap?: FooterProps['marginTop'];
  children: ReactNode;
};

type DefaultLayoutComponent = FC<DefaultLayoutProps> & {
  Main: FC<MainProps>;
};

export const DefaultLayout: DefaultLayoutComponent = ({
  footerGap,
  children,
}) => {
  return (
    <>
      <Header />
      <Container>{children}</Container>
      <Footer marginTop={footerGap} />
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

DefaultLayout.Main = Main;
