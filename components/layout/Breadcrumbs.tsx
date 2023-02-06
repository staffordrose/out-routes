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
        <HomeSeparatorRoot decorative orientation='vertical' />
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
  userSelect: 'none',
  '& > ul': {
    listStyle: 'none',
    display: 'grid',
    gridAutoFlow: 'column',
    justifyContent: 'start',
    alignContent: 'center',
    alignItems: 'center',
    maxWidth: '100vw',
    height: '$7',
    overflow: 'hidden',
    overflowX: 'auto',
    whiteSpace: 'nowrap',
    MsOverflowStyle: 'none' /* Internet Explorer 10+ */,
    scrollbarWidth: 'none' /* Firefox */,
    '&::-webkit-scrollbar': {
      display: 'none' /* Safari and Chrome */,
    },
  },
});

const SeparatorRoot = styled(Separator.Root, {
  width: '$px',
  height: '$full',
  marginX: '$3',
  backgroundColor: '$slate-300',
});

const HomeSeparatorRoot = styled(SeparatorRoot, {
  marginLeft: '$1_5',
});
