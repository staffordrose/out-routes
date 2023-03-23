import { FC, ReactNode } from 'react';

import { Footer, Header } from '@/components/layout';
import { styled } from '@/styles';

export type MultiColumnLayoutProps = {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  children: ReactNode;
};

type MultiColumnLayoutComponent = FC<MultiColumnLayoutProps> & {
  Aside: FC<AsideProps>;
  Main: FC<MainProps>;
  MainAside: FC<MainAsideProps>;
};

export const MultiColumnLayout: MultiColumnLayoutComponent = ({ children }) => {
  return (
    <>
      <Header />
      <Container>{children}</Container>
      <Footer />
    </>
  );
};

const Container = styled('div', {
  position: 'relative',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  width: '$full',
  minHeight: 'calc(100vh - $14)',
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
  },
  defaultVariants: {
    maxWidth: 'xl',
  },
});

// Aside
type AsideProps = {
  children: ReactNode;
};

const Aside: FC<AsideProps> = (props) => {
  return <StyledAside {...props} />;
};

const StyledAside = styled('aside', {
  flexShrink: 0,
  position: 'sticky',
  zIndex: 0,
  top: '$14',
  display: 'none',
  visibility: 'hidden',
  height: 'calc(100vh - $14)',
  borderRightWidth: '$1',
  borderRightStyle: 'solid',
  borderRightColor: '$slate-200',
  '@md': {
    display: 'block',
    visibility: 'visible',
    width: '$48',
  },
  '@lg': {
    width: '$64',
  },
});

MultiColumnLayout.Aside = Aside;

// Main
type MainProps = {
  children: ReactNode;
};

const Main: FC<MainProps> = (props) => {
  return <StyledMain {...props} />;
};

const StyledMain = styled('main', {
  position: 'relative',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  width: '$full',
  minHeight: 'calc(100vh - $14)',
});

MultiColumnLayout.Main = Main;

// MainAside
type MainAsideProps = {
  children: ReactNode;
};

const MainAside: FC<MainAsideProps> = (props) => {
  return <StyledMainAside {...props} />;
};

const StyledMainAside = styled('aside', {
  flexShrink: 0,
  position: 'sticky',
  top: '$14',
  zIndex: 0,
  display: 'none',
  visibility: 'hidden',
  width: '$full',
  height: 'calc(100vh - $14)',
  borderLeftWidth: '$1',
  borderLeftStyle: 'solid',
  borderLeftColor: '$slate-200',
  '@lg': {
    display: 'block',
    visibility: 'visible',
    width: '$64',
  },
});

MultiColumnLayout.MainAside = MainAside;
