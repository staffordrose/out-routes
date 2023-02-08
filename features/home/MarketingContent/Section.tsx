import { FC, ReactNode } from 'react';

import { styled } from '@/styles';

type SectionProps = {
  children: ReactNode;
};

type SectionComponent = FC<SectionProps> & {
  StickyColumn: FC<StickyColumnProps>;
  ScrollColumn: FC<ScrollColumnProps>;
  ColumnRow: FC<ColumnRowProps>;
  RowContent: typeof RowContent;
};

export const Section: SectionComponent = (props) => {
  return <StyledSection {...props} />;
};

const StyledSection = styled('section', {
  position: 'relative',
  display: 'grid',
  gridTemplateAreas: `
  "sticky"
  "scroll"
  `,
  width: '$full',
  maxWidth: '$container_xl',
  marginX: '$auto',
  '@sm': {
    gridTemplateAreas: 'none',
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
});

// StickyColumn
type StickyColumnProps = {
  children: ReactNode;
};

const StickyColumn: FC<StickyColumnProps> = (props) => {
  return <StyledStickyColumn {...props} />;
};

const StyledStickyColumn = styled('div', {
  gridArea: 'sticky',
  width: '$full',
  '& img': {
    borderRadius: '$none',
  },
  '@sm': {
    gridArea: 'unset',
    alignSelf: 'end',
    position: 'sticky',
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    placeItems: 'center',
    minHeight: 'calc(100vh - $14)',
  },
  '@xl': {
    '& img': {
      borderRadius: '$xl',
    },
  },
});

Section.StickyColumn = StickyColumn;

// Column
type ScrollColumnProps = {
  children: ReactNode;
};

const ScrollColumn: FC<ScrollColumnProps> = (props) => {
  return <StyledScrollColumn {...props} />;
};

const StyledScrollColumn = styled('div', {
  gridArea: 'scroll',
  width: '$full',
  '@sm': {
    gridArea: 'unset',
  },
});

Section.ScrollColumn = ScrollColumn;

// ColumnRow
type ColumnRowProps = {
  children: ReactNode;
};

const ColumnRow: FC<ColumnRowProps> = (props) => {
  return <StyledColumnRow {...props} />;
};

const StyledColumnRow = styled('div', {
  width: '$full',
  '@sm': {
    display: 'flex',
    flexDirection: 'column',
    placeItems: 'center',
    minHeight: 'calc(100vh - $14)',
  },
});

Section.ColumnRow = ColumnRow;

// RowContent
const RowContent = styled('article', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$5',
  alignItems: 'flex-start',
  width: '$full',
  marginY: '$4',
  paddingX: '$8',
  '& > h2': {
    fontSize: '$2xl',
    lineHeight: '$md',
  },
  '& > p': {
    fontSize: '$sm',
  },
  '@sm': {
    paddingX: '$8',
  },
  '@md': {
    paddingX: '$12',
    '& > h2': {
      fontSize: '$3xl',
    },
    '& > p': {
      fontSize: '$md',
    },
  },
  '@lg': {
    paddingX: '$16',
    '& > h2': {
      fontSize: '$4xl',
    },
    '& > p': {
      fontSize: '$lg',
    },
  },
});

Section.RowContent = RowContent;
