import { ForwardedRef, forwardRef } from 'react';

import { styled } from '@/styles';
import { Button, ButtonProps, IconButton, IconButtonProps } from '../atoms';

export type ResponsiveButtonProps = ButtonProps | IconButtonProps;

export const ResponsiveButton = forwardRef(
  (
    buttonProps: ResponsiveButtonProps,
    ref: ForwardedRef<HTMLButtonElement>
  ) => {
    return (
      <StyledResponsiveButton>
        <IconButton ref={ref} {...buttonProps} />
        <Button ref={ref} {...buttonProps} />
      </StyledResponsiveButton>
    );
  }
);

ResponsiveButton.displayName = 'ResponsiveButton';

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
