import { FC, ReactNode } from 'react';

import { Container, Footer, UnauthenticatedHeader } from '../layout';
import { styled } from '@/styles';

export type UnauthenticatedLayoutProps = {
  children: ReactNode;
};

type UnauthenticatedLayoutComponent = FC<UnauthenticatedLayoutProps> & {
  Main: FC<MainProps>;
  MainContent: FC<MainContentProps>;
};

export const UnauthenticatedLayout: UnauthenticatedLayoutComponent = ({
  children,
}) => {
  return (
    <>
      <UnauthenticatedHeader />
      <Container>{children}</Container>
      <Footer />
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

UnauthenticatedLayout.Main = Main;

type MainContentProps = {
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
  maxWidth: '$container_3xl',
  minHeight: 'calc(100vh - $14)',
  marginX: '$auto',
  variants: {
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
    paddingY: 'lg',
    paddingX: 'lg',
  },
});

UnauthenticatedLayout.MainContent = MainContent;
