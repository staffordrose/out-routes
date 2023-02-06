import {
  ComponentPropsWithoutRef,
  ElementType,
  ForwardedRef,
  forwardRef,
} from 'react';
import NextImage from 'next/image';
import * as RadixAvatar from '@radix-ui/react-avatar';
import type * as Stitches from '@stitches/react';

import { styled } from '@/styles';

enum AvatarSizes {
  'xs' = 32,
  'sm' = 40,
  'md' = 48,
  'lg' = 64,
  'xl' = 96,
  '2xl' = 192,
  '3xl' = 256,
}

export type AvatarProps = ComponentPropsWithoutRef<typeof AvatarRoot> & {
  as?: ElementType;
  css?: Stitches.CSS;
  size?: keyof typeof AvatarSizes;
  priority?: boolean;
  src?: string;
  firstName?: string;
  lastName?: string;
};

export const Avatar = forwardRef(
  (
    { size, priority, src, firstName, lastName, ...avatarProps }: AvatarProps,
    ref: ForwardedRef<HTMLImageElement>
  ) => {
    return (
      <AvatarRoot {...avatarProps} ref={ref} size={size}>
        {src ? (
          <StyledAvatar
            src={src}
            alt={`${firstName} ${lastName} Profile Photo`}
            width={AvatarSizes[(size || 'md') as keyof typeof AvatarSizes]}
            height={AvatarSizes[(size || 'md') as keyof typeof AvatarSizes]}
            priority={priority}
          />
        ) : (
          <AvatarFallback size={size}>
            {firstName?.[0]?.toUpperCase()}
            {lastName?.[0]?.toUpperCase()}
          </AvatarFallback>
        )}
      </AvatarRoot>
    );
  }
);

Avatar.displayName = 'Avatar';

const AvatarRoot = styled(RadixAvatar.Root, {
  flexShrink: 0,
  overflow: 'hidden',
  position: 'relative',
  display: 'inline-flex',
  placeItems: 'center',
  verticalAlign: 'middle',
  borderRadius: '$full',
  backgroundColor: '$black-900',
  userSelect: 'none',
  variants: {
    size: {
      xs: { width: '$8', height: '$8' },
      sm: { width: '$10', height: '$10' },
      md: { width: '$12', height: '$12' },
      lg: { width: '$16', height: '$16' },
      xl: { width: '$24', height: '$24' },
      '2xl': { width: '$48', height: '$48' },
      '3xl': { width: '$64', height: '$64' },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

const StyledAvatar = styled(NextImage, {
  borderRadius: 'inherit',
  objectFit: 'cover',
});

const AvatarFallback = styled(RadixAvatar.Fallback, {
  display: 'flex',
  placeItems: 'center',
  width: '$full',
  height: '$full',
  fontFamily: '$heading',
  fontWeight: '$medium',
  lineHeight: '$xs',
  color: '$slate-700',
  backgroundColor: '$slate-200',
  variants: {
    size: {
      xs: { fontSize: '$xs' },
      sm: { fontSize: '$md' },
      md: { fontSize: '$lg' },
      lg: { fontSize: '$2xl' },
      xl: { fontSize: '$4xl' },
      '2xl': { fontSize: '$6xl' },
      '3xl': { fontSize: '$8xl' },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});
