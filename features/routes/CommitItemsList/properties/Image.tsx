import { FC } from 'react';

import { AspectRatio, Box } from '@/components/atoms';

type ImageProps = {
  src?: string | null;
  alt: string;
};

export const Image: FC<ImageProps> = ({ src, alt }) => {
  if (!src) return null;
  return (
    <Box
      width='full'
      height='full'
      css={{
        maxWidth: '$60',
        paddingY: '$2',
        '& img': { objectFit: 'cover', objectPosition: '50% 50%' },
      }}
    >
      <AspectRatio ratio={16 / 9}>
        {
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={alt} />
        }
      </AspectRatio>
    </Box>
  );
};
