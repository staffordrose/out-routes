import { ForwardedRef, forwardRef } from 'react';

import { styled } from '@/styles';
import {
  ButtonLink,
  ButtonLinkProps,
  IconButtonLink,
  IconButtonLinkProps,
} from '../atoms';

export type ResponsiveButtonLinkProps = ButtonLinkProps | IconButtonLinkProps;

export const ResponsiveButtonLink = forwardRef(
  (
    linkProps: ResponsiveButtonLinkProps,
    ref: ForwardedRef<HTMLAnchorElement>
  ) => {
    return (
      <StyledResponsiveButtonLink>
        <IconButtonLink ref={ref} {...linkProps} />
        <ButtonLink ref={ref} {...linkProps} />
      </StyledResponsiveButtonLink>
    );
  }
);

ResponsiveButtonLink.displayName = 'ResponsiveButtonLink';

const StyledResponsiveButtonLink = styled('div', {
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
