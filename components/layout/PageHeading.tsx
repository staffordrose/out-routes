import { FC, ReactNode } from 'react';

import { styled } from '@/styles';
import { Heading } from '../atoms';
import { Breadcrumbs, Breadcrumb } from '../layout';

export type PageHeadingProps = {
  breadcrumbs?: Breadcrumb[];
  actions?: ReactNode;
  children?: ReactNode;
};

export const PageHeading: FC<PageHeadingProps> = ({
  breadcrumbs,
  actions,
  children,
}) => {
  return (
    <StyledPageHeading>
      {Array.isArray(breadcrumbs) && breadcrumbs.length > 0 && (
        <Breadcrumbs breadcrumbs={breadcrumbs} />
      )}
      <div>
        <StyledHeading as='h1'>{children}</StyledHeading>
        <StyledActions>{actions}</StyledActions>
      </div>
    </StyledPageHeading>
  );
};

const StyledPageHeading = styled('div', {
  width: '$full',
  borderBottomWidth: '$1',
  borderBottomStyle: 'solid',
  borderBottomColor: '$slate-200',
  '& > *:last-child': {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '$full',
    maxWidth: '$container_3xl',
    minHeight: '$14',
    marginX: '$auto',
    paddingX: '$4',
  },
});

const StyledHeading = styled(Heading, {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 1,
  lineClamp: 1,
});

const StyledActions = styled('div', {
  display: 'flex',
  gap: '$2',
  alignItems: 'center',
  height: '$full',
});
