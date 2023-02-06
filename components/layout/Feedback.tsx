import { FC, ReactNode } from 'react';
import { IconType } from 'react-icons';
import { BiCheckCircle, BiErrorCircle, BiFileBlank } from 'react-icons/bi';

import { styled } from '@/styles';
import { Flex, Icon, Loading } from '../atoms';

enum FeedbackTypes {
  LOADING = 'loading',
  ERROR = 'error',
  SUCCESS = 'success',
  EMPTY = 'empty',
}

const feedbackTypeIcons = {
  error: BiErrorCircle,
  success: BiCheckCircle,
  empty: BiFileBlank,
};

export type FeedbackProps = {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  icon?: IconType;
  type: `${FeedbackTypes}`;
  title: string;
  children?: ReactNode;
};

export const Feedback: FC<FeedbackProps> = ({
  type,
  icon,
  title,
  children,
  ...props
}) => {
  return (
    <StyledFeedback {...props} type={type}>
      <Flex gap='sm' alignItems='center'>
        {type === 'loading' ? (
          <Loading size='md' />
        ) : (
          <Icon as={icon || feedbackTypeIcons[type]} size='md' />
        )}
        <h2>{title}</h2>
      </Flex>
      {children}
    </StyledFeedback>
  );
};

const StyledFeedback = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  placeItems: 'center',
  gap: '$4',
  width: '$full',
  padding: '$4',
  textAlign: 'center',
  variants: {
    size: {
      xs: {
        minHeight: 'calc(20vh - $14)',
        '& > div > h2': {
          fontSize: '$lg',
        },
      },
      sm: {
        minHeight: 'calc(40vh - $14)',
        '& > div > h2': {
          fontSize: '$xl',
        },
      },
      md: {
        minHeight: 'calc(100vh - $76)',
        '& > div > h2': {
          fontSize: '$2xl',
        },
      },
      lg: {
        minHeight: 'calc(100vh - $14 - $30)',
        '& > div > h2': {
          fontSize: '$3xl',
        },
      },
      xl: {
        minHeight: 'calc(100vh - $14)',
        '& > div > h2': {
          fontSize: '$4xl',
        },
      },
    },
    type: {
      loading: {
        color: '$slate-700',
      },
      error: {
        color: '$red-700',
        backgroundColor: '$red-50',
      },
      success: {
        color: '$green-700',
        backgroundColor: '$green-50',
      },
      empty: {
        color: '$slate-700',
        backgroundColor: '$slate-50',
      },
    },
  },
  defaultVariants: {
    size: 'sm',
  },
});
