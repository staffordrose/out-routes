import { FC, ReactNode } from 'react';

import { styled } from '@/styles';
import { Container, Footer, FooterProps, Header } from '.';

type DefaultLayoutProps = {
  footerGap?: FooterProps['marginTop'];
  children: ReactNode;
};

type DefaultLayoutComponent = FC<DefaultLayoutProps> & {
  Main: FC<MainProps>;
  MainContent: FC<MainContentProps>;
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
  minHeight: 'calc(100vh - $14)',
});

DefaultLayout.Main = Main;

type MainContentProps = {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  paddingX?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  paddingTop?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  paddingBottom?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  paddingY?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  children: ReactNode;
};

const MainContent: FC<MainContentProps> = (props) => {
  return <StyledMainContent {...props} />;
};

const StyledMainContent = styled('div', {
  width: '$full',
  marginX: '$auto',
  variants: {
    maxWidth: {
      sm: { maxWidth: '$container_sm' },
      md: { maxWidth: '$container_md' },
      lg: { maxWidth: '$container_lg' },
      xl: { maxWidth: '$container_xl' },
      '2xl': { maxWidth: '$container_2xl' },
      '3xl': { maxWidth: '$container_3xl' },
    },
    paddingX: {
      none: { paddingX: '$0' },
      xs: { paddingX: '$1' },
      sm: { paddingX: '$2' },
      md: { paddingX: '$3' },
      lg: { paddingX: '$4' },
      xl: { paddingX: '$6' },
    },
    paddingTop: {
      none: { paddingTop: '$0' },
      xs: { paddingTop: '$1' },
      sm: { paddingTop: '$2' },
      md: { paddingTop: '$3' },
      lg: { paddingTop: '$4' },
      xl: { paddingTop: '$6' },
    },
    paddingBottom: {
      none: { paddingBottom: '$0' },
      xs: { paddingBottom: '$1' },
      sm: { paddingBottom: '$2' },
      md: { paddingBottom: '$3' },
      lg: { paddingBottom: '$4' },
      xl: { paddingBottom: '$6' },
    },
    paddingY: {
      none: { paddingY: '$0' },
      xs: { paddingY: '$1' },
      sm: { paddingY: '$2' },
      md: { paddingY: '$3' },
      lg: { paddingY: '$4' },
      xl: { paddingY: '$6' },
    },
  },
  defaultVariants: {
    maxWidth: '3xl',
    paddingY: 'lg',
    paddingX: 'lg',
  },
});

DefaultLayout.MainContent = MainContent;
