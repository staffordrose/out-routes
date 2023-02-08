import { FC } from 'react';
import { BiImageAlt } from 'react-icons/bi';

import { AspectRatio, Image } from '@/components/atoms';
import { styled } from '@/styles';

export type RouteDetailBannerProps = {
  src?: string;
  alt: string;
};

export const RouteDetailBanner: FC<RouteDetailBannerProps> = ({ src, alt }) => {
  return (
    <StyledRouteDetailBanner>
      <AspectRatio ratio={24 / 9}>
        {src ? (
          <Image fill priority src={src} alt={alt} objectFit='cover' />
        ) : (
          <BiImageAlt size='3rem' />
        )}
      </AspectRatio>
    </StyledRouteDetailBanner>
  );
};

const StyledRouteDetailBanner = styled('div', {
  width: '$full',
  backgroundColor: '$slate-50',
  '& > div': {
    width: '$full',
    maxWidth: '$container_2xl',
    marginX: '$auto',
  },
});
