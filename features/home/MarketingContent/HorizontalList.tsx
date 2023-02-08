import { FC, ReactNode } from 'react';

import { styled } from '@/styles';
import { Separator } from '@/components/atoms';

type HorizontalListProps = {
  title: string;
  children: ReactNode;
};

type HorizontalListComponent = FC<HorizontalListProps> & {
  ListItem: FC<ListItemProps>;
};

export const HorizontalList: HorizontalListComponent = ({
  title,
  children,
}) => {
  return (
    <StyledHorizontalList>
      <h2>{title}</h2>
      <Separator width='1-4' height='md' colorScale={900} />
      <ul>{children}</ul>
    </StyledHorizontalList>
  );
};

const StyledHorizontalList = styled('div', {
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  gap: '$6',
  width: '$full',
  maxWidth: '$container_xl',
  marginX: '$auto',
  paddingBottom: '$6',
  '&::before': {
    content: '',
    position: 'absolute',
    zIndex: 10,
    top: 0,
    left: 0,
    width: '$8',
    height: '$full',
    background: 'linear-gradient(to right, $white, transparent)',
  },
  '&::after': {
    content: '',
    position: 'absolute',
    zIndex: 10,
    top: 0,
    right: 0,
    width: '$8',
    height: '$full',
    background: 'linear-gradient(to left, $white, transparent)',
  },
  '& > h2': {
    fontSize: '$2xl',
    lineHeight: '$md',
  },
  '& > *:not(ul)': {
    marginX: '$8',
  },
  '& > ul': {
    listStyle: 'none',
    overflowX: 'auto',
    display: 'flex',
    gap: '$6',
    alignItems: 'flex-start',
    paddingX: '$8',
    scrollPaddingLeft: '$8',
    scrollSnapType: 'x mandatory',
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
    '& > li': {
      scrollSnapAlign: 'start',
    },
  },
  '@md': {
    paddingX: '$4',
    '&::before': {
      left: '$4',
    },
    '&::after': {
      right: '$4',
    },
    '& > h2': {
      fontSize: '$3xl',
    },
  },
  '@lg': {
    paddingX: '$8',
    '&::before': {
      left: '$8',
    },
    '&::after': {
      right: '$8',
    },
    '& > h2': {
      fontSize: '$4xl',
    },
  },
});

// ListItem
type ListItemProps = {
  children: ReactNode;
};

const ListItem: FC<ListItemProps> = (props) => {
  return <StyledListItem {...props} />;
};

const StyledListItem = styled('li', {
  '& > *': {
    width: 224,
  },
});

HorizontalList.ListItem = ListItem;
