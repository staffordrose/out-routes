import { FC, useState } from 'react';
import { NextRouter, useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';
import queryString from 'query-string';
import { useQuery } from '@tanstack/react-query';
import * as RadixDropdownMenu from '@radix-ui/react-dropdown-menu';
import { keyframes } from '@stitches/react';
import { BiDotsVerticalRounded, BiMapAlt, BiSearch } from 'react-icons/bi';

import { sitename } from '@/data/site';
import { SearchDialog } from '@/features/search';
import { getUser } from '@/lib/v1/api/user';
import { styled } from '@/styles';
import { User } from '@/types';
import {
  Avatar,
  ButtonLink,
  FauxInput,
  Flex,
  IconButton,
  IconButtonLink,
  Link,
  Text,
} from '../atoms';

export const Header: FC = () => {
  const { data: session } = useSession();

  const email = session?.user?.email || '';

  const enabled = !!email;

  const { data: user, isSuccess } = useQuery({
    queryKey: ['user'],
    queryFn: () => getUser(),
    staleTime: 300_000,
    enabled,
    retry: false,
  });

  if (enabled && isSuccess) {
    return <AuthenticatedHeader user={user} email={email} />;
  }
  return <UnauthenticatedHeader />;
};

type AuthenticatedHeaderProps = {
  email: string;
  user: User;
};

const AuthenticatedHeader: FC<AuthenticatedHeaderProps> = ({ email, user }) => {
  const router = useRouter();

  return (
    <StyledHeader>
      <div>
        <Flex gap='sm' alignItems='center'>
          <Logo />
          <Search />
        </Flex>
        <StyledNav>
          <ul>
            <li>
              <IconButtonLink
                variant='ghost'
                size='md'
                borderRadius='full'
                href='/account'
              >
                <Avatar
                  size='sm'
                  src={user.image_thumb_64 || ''}
                  firstName={user.name?.split(' ')[0] || ''}
                  lastName={user.name?.split(' ')[1] || ''}
                />
              </IconButtonLink>
            </li>
            <li>
              <DropdownMenu router={router} email={email} user={user} />
            </li>
          </ul>
        </StyledNav>
      </div>
    </StyledHeader>
  );
};

export const UnauthenticatedHeader: FC = () => {
  return (
    <StyledHeader>
      <div>
        <Flex gap='sm' alignItems='center'>
          <Logo />
          <Search />
        </Flex>
        <StyledNav>
          <ul>
            <li>
              <Link fontFamily='heading' href='/explore'>
                Explore
              </Link>
            </li>
            <li>
              <Link fontFamily='heading' href='/account/sign-in'>
                Sign In
              </Link>
            </li>
            <li>
              <ButtonLink
                href={`/account/sign-in?${queryString.stringify({
                  type: 'create',
                })}`}
              >
                Sign Up
              </ButtonLink>
            </li>
          </ul>
        </StyledNav>
      </div>
    </StyledHeader>
  );
};

export const FauxHeader: FC = () => {
  return (
    <StyledFauxHeader>
      <Flex placeItems='center' width='full' aria-label={`${sitename} Logo`}>
        <BiMapAlt />
        <Text as='span' fontFamily='heading' fontSize='2xl' fontWeight='medium'>
          {sitename}
        </Text>
      </Flex>
    </StyledFauxHeader>
  );
};

const StyledHeader = styled('header', {
  position: 'fixed',
  zIndex: '$appbar',
  top: 0,
  left: 0,
  width: '$full',
  height: '$14',
  borderBottomWidth: '$2',
  borderBottomStyle: 'dashed',
  borderBottomColor: '$slate-300',
  backgroundColor: '$slate-100',
  '& > div': {
    display: 'flex',
    gap: '$4',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '$full',
    maxWidth: '$container_xl',
    height: '$full',
    marginX: '$auto',
    paddingX: '$4',
  },
});

const StyledFauxHeader = styled(StyledHeader, {
  '& > div': {
    gap: '$2_5',
    padding: '0 $2_5',
    justifyContent: 'center',
    '& > svg': {
      width: '$9',
      height: '$9',
    },
  },
});

const StyledNav = styled('nav', {
  '& > ul': {
    display: 'flex',
    gap: '$2',
    alignItems: 'center',
    width: '$full',
    margin: 0,
    listStyle: 'none',
  },
});

// Logo
const Logo = () => {
  return (
    <StyledLogo>
      <IconButtonLink
        variant='ghost'
        size='md'
        aria-label={`${sitename} Home Page`}
        href='/'
      >
        <BiMapAlt />
      </IconButtonLink>
      <ButtonLink
        variant='ghost'
        size='md'
        aria-label={`${sitename} Home Page`}
        href='/'
      >
        <BiMapAlt />
        <span>{sitename}</span>
      </ButtonLink>
    </StyledLogo>
  );
};

const StyledLogo = styled('div', {
  '& > a:first-child': {
    display: 'inline-flex',
    visibility: 'visible',
  },
  '& > a:last-child': {
    display: 'none',
    visibility: 'hidden',
  },
  '@md': {
    '& > a:first-child': {
      display: 'none',
      visibility: 'hidden',
    },
    '& > a:last-child': {
      display: 'inline-flex',
      visibility: 'visible',
    },
  },
});

// Search
const Search = () => {
  const [isDialogOpen, setDialogOpen] = useState(false);

  return (
    <SearchDialog isDialogOpen={isDialogOpen} setDialogOpen={setDialogOpen}>
      <StyledSearch>
        <IconButton variant='ghost' size='md'>
          <BiSearch />
        </IconButton>
        <FauxInput>
          <Flex
            display='inline-flex'
            gap='sm'
            justifyContent='space-between'
            width='full'
          >
            <Flex display='inline-flex' gap='xs' alignItems='center'>
              <BiSearch size='1.5rem' />
              <span>Search</span>
            </Flex>
          </Flex>
        </FauxInput>
      </StyledSearch>
    </SearchDialog>
  );
};

const StyledSearch = styled('div', {
  '& > button:first-child': {
    display: 'flex',
    visibility: 'visible',
  },
  '& > button:last-child': {
    display: 'none',
    visibility: 'hidden',
  },
  '@md': {
    '& > button:first-child': {
      display: 'none',
      visibility: 'hidden',
    },
    '& > button:last-child': {
      display: 'flex',
      visibility: 'visible',
    },
  },
});

// DropdownMenu
type DropdownMenuProps = {
  router: NextRouter;
  email: string;
  user: User;
};

const DropdownMenu: FC<DropdownMenuProps> = ({ router, email, user }) => {
  return (
    <RadixDropdownMenu.Root>
      <RadixDropdownMenu.Trigger asChild>
        <IconButton
          variant='ghost'
          size='md'
          borderRadius='full'
          aria-label='Open menu'
        >
          <BiDotsVerticalRounded />
        </IconButton>
      </RadixDropdownMenu.Trigger>

      <RadixDropdownMenu.Portal>
        <DropdownMenuContent side='bottom' sideOffset={-4} align='end'>
          <DropdownMenuArrow />
          <DropdownMenuHeader>
            <Flex gap='sm' alignItems='center'>
              <Avatar
                size='xs'
                src={user.image_thumb_32 || ''}
                firstName={user.name?.split(' ')[0] || ''}
                lastName={user.name?.split(' ')[1] || ''}
              />
              <span>{email}</span>
            </Flex>
          </DropdownMenuHeader>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => {
              router.push(`/explore`);
            }}
          >
            Explore
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => {
              router.push(`/routes/add`);
            }}
          >
            Add route
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => {
              router.push(`/routes`);
            }}
          >
            Your routes
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => {
              router.push(`/${user.username}`);
            }}
          >
            Your profile
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => {
              router.push(`/account`);
            }}
          >
            Account
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => {
              signOut();
            }}
          >
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </RadixDropdownMenu.Portal>
    </RadixDropdownMenu.Root>
  );
};

const slideUpAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateY(2px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' },
});

const slideRightAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateX(-2px)' },
  '100%': { opacity: 1, transform: 'translateX(0)' },
});

const slideDownAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateY(-2px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' },
});

const slideLeftAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateX(2px)' },
  '100%': { opacity: 1, transform: 'translateX(0)' },
});

const DropdownMenuContent = styled(RadixDropdownMenu.Content, {
  zIndex: '$menu',
  minWidth: '$56',
  padding: '$2',
  borderWidth: '$2',
  borderStyle: 'dashed',
  borderColor: '$slate-500',
  borderRadius: '$lg',
  backgroundColor: '$slate-50',
  boxShadow:
    '0px 10px 38px -10px rgba(22, 23, 24, 0.35), 0px 10px 20px -15px rgba(22, 23, 24, 0.2)',
  animationDuration: '400ms',
  animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
  willChange: 'transform, opacity',
  '&[data-state="open"]': {
    '&[data-side="top"]': { animationName: slideDownAndFade },
    '&[data-side="right"]': { animationName: slideLeftAndFade },
    '&[data-side="bottom"]': { animationName: slideUpAndFade },
    '&[data-side="left"]': { animationName: slideRightAndFade },
  },
});

const DropdownMenuArrow = styled(RadixDropdownMenu.Arrow, {
  width: '$3',
  height: '$2',
  fill: '$slate-500',
});

const DropdownMenuHeader = styled(RadixDropdownMenu.Label, {
  fontSize: '$sm',
  color: '$slate-500',
});

const DropdownMenuSeparator = styled(RadixDropdownMenu.Separator, {
  height: '$px',
  margin: '$2 0',
  backgroundColor: '$slate-200',
});

const DropdownMenuItem = styled(RadixDropdownMenu.Item, {
  all: 'unset',
  boxSizing: 'border-box',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  height: '$8',
  padding: '0 $2',
  borderRadius: '$md',
  fontSize: '$sm',
  lineHeight: '$xs',
  color: '$slate-900',
  cursor: 'pointer',
  userSelect: 'none',
  '&[data-disabled]': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  '&[data-highlighted]': {
    backgroundColor: '$slate-200',
  },
});
