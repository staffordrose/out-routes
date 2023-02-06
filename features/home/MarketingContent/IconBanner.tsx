import type { FC, ReactNode } from 'react';
import type { IconType } from 'react-icons';

import { Icon } from '@/components/atoms';
import { styled } from '@/styles';

type IconBannerProps = {
  icon: IconType;
  children: ReactNode;
};

export const IconBanner: FC<IconBannerProps> = ({ icon, children }) => {
  return (
    <StyledIconBanner>
      <Content>
        <Icon as={icon} size='4xl' />
        {children}
      </Content>
    </StyledIconBanner>
  );
};

const StyledIconBanner = styled('div', {
  width: '$full',
  backgroundColor: '$slate-100',
});

const Content = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$4',
  placeItems: 'center',
  width: '$full',
  maxWidth: '$container_md',
  marginX: '$auto',
  paddingX: '$8',
  paddingY: '$12',
  textAlign: 'center',
  '@md': {
    paddingX: '$12',
  },
  '@lg': {
    paddingX: '$16',
  },
});
