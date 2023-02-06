import { ComponentPropsWithoutRef, FC } from 'react';

import { Flex, Grid as GridComp, Heading, HeadingProps } from '../atoms';

export type CardListProps = ComponentPropsWithoutRef<typeof Flex> & {
  title?: string | number;
};

type CardListComponent = FC<CardListProps> & {
  Group: FC<GroupProps>;
  Grid: FC<GridProps>;
};

export const CardList: CardListComponent = ({
  direction = 'column',
  gap = 'lg',
  title,
  children,
  ...props
}) => {
  return (
    <Flex {...props} direction={direction} gap={gap}>
      {!!title && <h2>{title}</h2>}
      {children}
    </Flex>
  );
};

// Card Group
type GroupProps = ComponentPropsWithoutRef<typeof Flex> & {
  title?: string;
  titleAs?: HeadingProps['as'];
};

const Group: FC<GroupProps> = ({
  direction = 'column',
  gap = 'lg',
  title,
  titleAs = 'h3',
  children,
  ...props
}) => {
  return (
    <Flex {...props} direction={direction} gap={gap}>
      {!!title && <Heading as={titleAs}>{title}</Heading>}
      {children}
    </Flex>
  );
};

CardList.Group = Group;

// Card Grid
type GridProps = ComponentPropsWithoutRef<typeof GridComp>;

const Grid: FC<GridProps> = ({ gap = 'md', ...props }) => {
  return <GridComp {...props} gap={gap} />;
};

CardList.Grid = Grid;
