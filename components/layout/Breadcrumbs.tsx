import { FC, Fragment, ReactNode } from 'react';
import * as Separator from '@radix-ui/react-separator';
import { BiHome } from 'react-icons/bi';

import { styled } from '@/styles';
import { IconButtonLink, Link, Text } from '../atoms';

export type Breadcrumb = {
  id: string;
  href?: string;
  children: ReactNode;
};

export type BreadcrumbsProps = {
  breadcrumbs: Breadcrumb[];
};

export const Breadcrumbs: FC<BreadcrumbsProps> = ({ breadcrumbs }) => {
  return (
    <StyledBreadcrumbs>
      <ul>
        <li>
          <IconButtonLink
            variant='ghost'
            size='xs'
            borderRadius='full'
            href='/'
          >
            <BiHome />
          </IconButtonLink>
        </li>
        <SeparatorRoot decorative orientation='vertical' />
        {breadcrumbs.map(({ id, href, children }, index) => {
          return (
            <Fragment key={id}>
              <li>
                {href ? (
                  <Link fontFamily='heading' fontSize='sm' href={href}>
                    {children}
                  </Link>
                ) : (
                  <Text as='span' fontFamily='heading' fontSize='sm'>
                    {children}
                  </Text>
                )}
              </li>
              {index < breadcrumbs.length - 1 && (
                <SeparatorRoot decorative orientation='vertical' />
              )}
            </Fragment>
          );
        })}
      </ul>
    </StyledBreadcrumbs>
  );
};

const StyledBreadcrumbs = styled('nav', {
  height: '$8',
  borderBottomWidth: '$1',
  borderBottomStyle: 'solid',
  borderBottomColor: '$slate-200',
  userSelect: 'none',
  '& > ul': {
    listStyle: 'none',
    display: 'grid',
    gridAutoFlow: 'column',
    justifyContent: 'start',
    alignContent: 'center',
    alignItems: 'center',
    maxWidth: '$container_3xl',
    marginX: '$auto',
    height: '$full',
    overflow: 'hidden',
    overflowX: 'auto',
    whiteSpace: 'nowrap',
    MsOverflowStyle: 'none' /* Internet Explorer 10+ */,
    scrollbarWidth: 'none' /* Firefox */,
    '&::-webkit-scrollbar': {
      display: 'none' /* Safari and Chrome */,
    },
    '& > li': {
      paddingLeft: '$5',
      paddingRight: '$4',
    },
    '& > li:first-child': {
      paddingX: '$3',
    },
  },
});

const SeparatorRoot = styled(Separator.Root, {
  width: '$px',
  height: '$8',
  marginX: '$0',
  backgroundColor: '$slate-200',
  '-webkit-transform-origin': '100% 100%',
  '-ms-transform-origin': '100% 100%',
  'transform-origin': '100% 100%',
  '-webkit-transform': 'rotate(15deg)',
  '-ms-transform': 'rotate(15deg)',
  transform: 'rotate(15deg)',
});
