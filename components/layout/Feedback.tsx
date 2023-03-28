import { FC, ReactNode } from 'react';
import { IconType } from 'react-icons';
import { BiCheckCircle, BiErrorCircle, BiFileBlank } from 'react-icons/bi';

import { styled } from '@/styles';
import { Flex, Icon, IconProps, Loading } from '../atoms';

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
  size?:
    | 'xs'
    | 'sm'
    | 'md'
    | 'lg'
    | 'xl'
    | 'full-header-crumbs-title-tabs-subtitle'
    | 'full-header-crumbs-title-tabs'
    | 'full-header-crumbs-title'
    | 'full-header-title'
    | 'full-header-crumbs'
    | 'full-header'
    | 'full';
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
          <Icon
            as={icon || feedbackTypeIcons[type]}
            size={
              (props.size
                ? ['xs', 'sm', 'md', 'lg', 'xl'].includes(props.size)
                  ? props.size
                  : 'xl'
                : 'md') as IconProps['size']
            }
          />
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
        gap: '$2',
        minHeight: '$32',
        padding: '$4',
        '& h2': {
          fontSize: '$lg',
        },
      },
      sm: {
        gap: '$3',
        minHeight: '$48',
        padding: '$4',
        '& h2': {
          fontSize: '$xl',
        },
      },
      md: {
        gap: '$4',
        minHeight: '$64',
        padding: '$4',
        '& h2': {
          fontSize: '$2xl',
        },
      },
      lg: {
        gap: '$5',
        minHeight: '$96',
        padding: '$5',
        '& h2': {
          fontSize: '$3xl',
        },
      },
      xl: {
        gap: '$6',
        minHeight: '$112',
        padding: '$6',
        '& h2': {
          fontSize: '$4xl',
        },
      },
      'full-header-crumbs-title-tabs-subtitle': {
        gap: '$6',
        minHeight: 'calc(100vh - $14 - $8 - $16 - $12 - $16)',
        padding: '$6',
        '& h2': {
          fontSize: '$4xl',
        },
      },
      'full-header-crumbs-title-tabs': {
        gap: '$6',
        minHeight: 'calc(100vh - $14 - $8 - $16 - $12)',
        padding: '$6',
        '& h2': {
          fontSize: '$4xl',
        },
      },
      'full-header-crumbs-title': {
        gap: '$6',
        minHeight: 'calc(100vh - $14 - $8 - $14)',
        padding: '$6',
        '& h2': {
          fontSize: '$4xl',
        },
      },
      'full-header-title': {
        gap: '$6',
        minHeight: 'calc(100vh - $14 - $16)',
        padding: '$6',
        '& h2': {
          fontSize: '$4xl',
        },
      },
      'full-header-crumbs': {
        gap: '$6',
        minHeight: 'calc(100vh - $14 - $8)',
        padding: '$6',
        '& h2': {
          fontSize: '$4xl',
        },
      },
      'full-header': {
        gap: '$6',
        minHeight: 'calc(100vh - $14)',
        padding: '$6',
        '& h2': {
          fontSize: '$4xl',
        },
      },
      full: {
        gap: '$6',
        minHeight: '100vh',
        padding: '$6',
        '& h2': {
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
