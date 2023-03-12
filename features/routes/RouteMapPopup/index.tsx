import { FC, ReactNode } from 'react';

import { styled } from '@/styles';
import { Content, ContentProps } from './Content';
import { ActionHeader, ActionHeaderProps, Header, HeaderProps } from './Header';

type RouteMapPopupProps = {
  children: ReactNode;
};

type RouteMapPopupComponent = FC<RouteMapPopupProps> & {
  ActionHeader: FC<ActionHeaderProps>;
  Header: FC<HeaderProps>;
  Content: FC<ContentProps>;
};

export const RouteMapPopup: RouteMapPopupComponent = (props) => {
  return <StyledRouteMapPopup {...props} />;
};

RouteMapPopup.ActionHeader = ActionHeader;
RouteMapPopup.Header = Header;
RouteMapPopup.Content = Content;

const StyledRouteMapPopup = styled('div', {
  '& > div:first-child': {
    position: 'sticky',
    top: 0,
    left: 0,
  },
  '& > div:last-child': {
    overflowY: 'auto',
    height: 'calc($52 - $12)',
  },
  '@md': {
    '& > div:last-child': {
      height: 'calc($64 - $12)',
    },
  },
});
