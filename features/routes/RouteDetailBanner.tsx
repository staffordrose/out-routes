import { FC } from 'react';

import { AspectRatio, Image } from '@/components/atoms';
import { styled } from '@/styles';

export type RouteDetailBannerProps = {
  src?: string;
  alt: string;
};

export const RouteDetailBanner: FC<RouteDetailBannerProps> = ({ src, alt }) => {
  if (!src) return null;

  return (
    <StyledRouteDetailBanner>
      <AspectRatio ratio={24 / 9}>
        <Image fill priority src={src} alt={alt} objectFit='cover' />
      </AspectRatio>
    </StyledRouteDetailBanner>
  );
};

const StyledRouteDetailBanner = styled('div', {
  width: '$full',
  borderBottomWidth: '$1',
  borderBottomStyle: 'solid',
  borderBottomColor: '$slate-200',
  backgroundColor: '$slate-50',
  '& > div': {
    width: '$full',
    maxWidth: '$container_2xl',
    marginX: '$auto',
  },
});
