import { ComponentPropsWithoutRef, FC, ReactNode } from 'react';

import { styled } from '@/styles';
import {
  Button,
  ButtonLink,
  ButtonLinkProps,
  ButtonProps,
  Dialog,
  DialogProps,
  Heading,
  IconButton,
  IconButtonLink,
} from '../atoms';
import { Breadcrumbs, Breadcrumb } from '../layout';

export type Action = {
  id: string;
} & (
  | ({
      actionType: 'button';
    } & ComponentPropsWithoutRef<typeof Button>)
  | ({
      actionType: 'responsive-button';
    } & ComponentPropsWithoutRef<typeof IconButton>)
  | ({
      actionType: 'link';
    } & ComponentPropsWithoutRef<typeof ButtonLink>)
  | ({
      actionType: 'responsive-link';
    } & ComponentPropsWithoutRef<typeof IconButtonLink>)
  | ({
      actionType: 'dialog';
    } & ComponentPropsWithoutRef<typeof Dialog>)
);

export type PageHeadingProps = {
  breadcrumbs?: Breadcrumb[];
  actions?: Action[];
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
        <StyledActions>
          {Array.isArray(actions) &&
            actions.length > 0 &&
            actions.map(({ id, actionType, ...props }) => {
              const buttonProps = props as ButtonProps;
              const buttonLinkProps = props as ButtonLinkProps;
              const dialogProps = props as DialogProps;

              switch (actionType) {
                case 'button':
                  return <Button key={id} {...buttonProps} />;
                case 'responsive-button':
                  return (
                    <StyledResponsiveButton key={id}>
                      <IconButton {...buttonProps} />
                      <Button {...buttonProps} />
                    </StyledResponsiveButton>
                  );
                case 'link':
                  return <ButtonLink key={id} {...buttonLinkProps} />;
                case 'responsive-link':
                  return (
                    <StyledResponsiveLink key={id}>
                      <IconButtonLink {...buttonLinkProps} />
                      <ButtonLink {...buttonLinkProps} />
                    </StyledResponsiveLink>
                  );
                case 'dialog':
                  return <Dialog key={id} {...dialogProps} />;
                default:
                  return null;
              }
            })}
        </StyledActions>
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

const StyledResponsiveButton = styled('div', {
  '& > button:first-child': {
    display: 'inline-flex',
    visibility: 'visible',
    '@md': {
      display: 'none',
      visibility: 'hidden',
    },
    '& > span': {
      display: 'none',
      visibility: 'hidden',
    },
  },
  '& > button:last-child': {
    display: 'none',
    visibility: 'hidden',
    '@md': {
      display: 'inline-flex',
      visibility: 'visible',
    },
  },
});

const StyledResponsiveLink = styled('div', {
  '& > a:first-child': {
    display: 'inline-flex',
    visibility: 'visible',
    '@md': {
      display: 'none',
      visibility: 'hidden',
    },
    '& > span': {
      display: 'none',
      visibility: 'hidden',
    },
  },
  '& > a:last-child': {
    display: 'none',
    visibility: 'hidden',
    '@md': {
      display: 'inline-flex',
      visibility: 'visible',
    },
  },
});
