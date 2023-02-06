import { FC } from 'react';
import queryString from 'query-string';

import { ButtonLink, Image } from '@/components/atoms';
import { styled } from '@/styles';

const SIGN_IN_HREF = `/account/sign-in?${queryString.stringify({
  type: 'create',
})}`;

export const HeroSection: FC = () => {
  return (
    <StyledHeroSection>
      <Image
        priority
        fill
        src='/images/hero.jpg'
        alt='OutRoutes Hero Image'
        objectFit='cover'
        objectPosition='bottom-right'
      />
      <HeroContent>
        <h1>Route Betas for Technical Adventures</h1>
        <p>
          Build routes & share knowledge with fellow backcountry enthusiasts
        </p>
        <HeroAction />
      </HeroContent>
    </StyledHeroSection>
  );
};

const StyledHeroSection = styled('div', {
  position: 'relative',
  width: '$full',
  background: 'linear-gradient(45deg, $slate-300, transparent 66.7%)',
  '& > img': {
    position: 'absolute',
    zIndex: -1,
    top: 0,
    left: 0,
  },
});

const HeroContent = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$6',
  justifyContent: 'center',
  alignItems: 'flex-start',
  width: '$full',
  maxWidth: '$container_xl',
  minHeight: 'calc(100vh - $14)',
  marginX: '$auto',
  paddingX: '$8',
  paddingY: '$16',
  '& > h1': {
    maxWidth: 640,
    fontSize: '$4xl',
    fontWeight: '$bold',
    lineHeight: '$sm$sm',
  },
  '& > p': {
    maxWidth: 360,
    fontFamily: '$heading',
    fontSize: '$xl',
    fontWeight: '$medium',
  },
  '@md': {
    paddingX: '$12',
    '& > h1': {
      fontSize: '$5xl',
    },
    '& > p': {
      maxWidth: 480,
      fontFamily: '$heading',
      fontSize: '$2xl',
      fontWeight: '$medium',
    },
  },
  '@lg': {
    paddingX: '$16',
    '& > h1': {
      fontSize: '$6xl',
    },
    '& > p': {
      maxWidth: 540,
      fontFamily: '$heading',
      fontSize: '$3xl',
      fontWeight: '$medium',
    },
  },
});

const HeroAction: FC = () => {
  return (
    <StyledHeroAction>
      <ButtonLink size='md' href={SIGN_IN_HREF}>
        Create your first route
      </ButtonLink>
      <ButtonLink size='lg' href={SIGN_IN_HREF}>
        Create your first route
      </ButtonLink>
      <ButtonLink size='xl' href={SIGN_IN_HREF}>
        Create your first route
      </ButtonLink>
    </StyledHeroAction>
  );
};

const StyledHeroAction = styled('div', {
  '& > a:nth-of-type(2)': {
    display: 'none',
    visibility: 'hidden',
  },
  '& > a:nth-of-type(3)': {
    display: 'none',
    visibility: 'hidden',
  },
  '@md': {
    '& > a:nth-of-type(1)': {
      display: 'none',
      visibility: 'hidden',
    },
    '& > a:nth-of-type(2)': {
      display: 'inline-flex',
      visibility: 'visible',
    },
  },
  '@lg': {
    '& > a:nth-of-type(2)': {
      display: 'none',
      visibility: 'hidden',
    },
    '& > a:nth-of-type(3)': {
      display: 'inline-flex',
      visibility: 'visible',
    },
  },
});
