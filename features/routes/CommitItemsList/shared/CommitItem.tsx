import { FC, ReactNode } from 'react';
import { BiMinus, BiPlus } from 'react-icons/bi';

import { Flex, Heading, Icon } from '@/components/atoms';
import { styled } from '@/styles';

type CommitItemProps = {
  name: string;
} & (
  | {
      type: 'add';
      prevChildren?: never;
      nextChildren: ReactNode;
    }
  | {
      type: 'update';
      prevChildren: ReactNode;
      nextChildren: ReactNode;
    }
  | {
      type: 'remove';
      prevChildren: ReactNode;
      nextChildren?: never;
    }
);

export const CommitItem: FC<CommitItemProps> = ({
  type,
  name,
  prevChildren,
  nextChildren,
}) => {
  return (
    <div>
      <Heading as='h4' lineHeight='4xl'>
        {name}
      </Heading>
      {type !== 'add' && <Change type='minus'>{prevChildren}</Change>}
      {type !== 'remove' && <Change type='plus'>{nextChildren}</Change>}
    </div>
  );
};

type ChangeProps = { type: 'plus' | 'minus'; children: ReactNode };

const Change: FC<ChangeProps> = ({ type, children }) => {
  return (
    <StyledChange type={type}>
      <Flex gap='sm' alignItems='flex-start' width='full'>
        <LeftColumn>
          <IconWrapper>
            <Icon as={type === 'minus' ? BiMinus : BiPlus} size='xs' />
          </IconWrapper>
        </LeftColumn>
        <ChildrenWrapper>{children}</ChildrenWrapper>
      </Flex>
    </StyledChange>
  );
};

const LeftColumn = styled('div', {
  display: 'block',
  width: '$8',
  minHeight: '$full',
});

const IconWrapper = styled('div', {
  display: 'flex',
  placeItems: 'center',
  width: '$8',
  height: '$8',
});

const ChildrenWrapper = styled('div', {
  display: 'flex',
  alignItems: 'center',
  width: '$full',
  minHeight: '$8',
  paddingY: '$1',
});

const StyledChange = styled('div', {
  display: 'flex',
  fontSize: '$sm',
  variants: {
    type: {
      plus: {
        color: '$green-800',
        backgroundColor: '$green-100',
        [`${LeftColumn}`]: {
          backgroundColor: '$green-200',
        },
      },
      minus: {
        color: '$red-800',
        backgroundColor: '$red-100',
        [`${LeftColumn}`]: {
          backgroundColor: '$red-200',
        },
      },
    },
  },
});
