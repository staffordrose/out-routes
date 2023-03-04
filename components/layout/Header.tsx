import { FC, useState } from 'react';
import { NextRouter, useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';
import queryString from 'query-string';
import { useQuery } from '@tanstack/react-query';
import { BiDotsVerticalRounded, BiMapAlt, BiSearch } from 'react-icons/bi';

import { sitename } from '@/data/site';
import { SearchDialog } from '@/features/search';
import { getUser } from '@/lib/v1/api/user';
import { styled } from '@/styles';
import { User } from '@/types';
import {
  Avatar,
  ButtonLink,
  DropdownMenu as DropdownMenuComp,
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
  position: 'sticky',
  zIndex: '$appbar',
  top: 0,
  left: 0,
  width: '$full',
  height: '$14',
  borderBottomWidth: '$1',
  borderBottomStyle: 'solid',
  borderBottomColor: '$slate-300',
  backgroundColor: '$slate-50',
  '& > div': {
    display: 'flex',
    gap: '$4',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '$full',
    maxWidth: '$container_3xl',
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
    <DropdownMenuComp
      sideOffset={-4}
      items={[
        <DropdownMenuComp.Header key='header'>
          <Flex gap='sm' alignItems='center'>
            <Avatar
              size='xs'
              src={user.image_thumb_32 || ''}
              firstName={user.name?.split(' ')[0] || ''}
              lastName={user.name?.split(' ')[1] || ''}
            />
            <span>{email}</span>
          </Flex>
        </DropdownMenuComp.Header>,
        <DropdownMenuComp.Separator key='separator-1' />,
        <DropdownMenuComp.Item
          key='explore'
          onSelect={() => {
            router.push(`/explore`);
          }}
        >
          Explore
        </DropdownMenuComp.Item>,
        <DropdownMenuComp.Item
          key='add-route'
          onSelect={() => {
            router.push(`/routes/add`);
          }}
        >
          Add route
        </DropdownMenuComp.Item>,
        <DropdownMenuComp.Item
          key='routes'
          onSelect={() => {
            router.push(`/routes`);
          }}
        >
          Your routes
        </DropdownMenuComp.Item>,
        <DropdownMenuComp.Item
          key='profile'
          onSelect={() => {
            router.push(`/${user.username}`);
          }}
        >
          Your profile
        </DropdownMenuComp.Item>,
        <DropdownMenuComp.Separator key='separator-2' />,
        <DropdownMenuComp.Item
          key='account'
          onSelect={() => {
            router.push(`/account`);
          }}
        >
          Account
        </DropdownMenuComp.Item>,
        <DropdownMenuComp.Separator key='separator-3' />,
        <DropdownMenuComp.Item
          key='sign-out'
          onSelect={() => {
            signOut();
          }}
        >
          Sign out
        </DropdownMenuComp.Item>,
      ]}
    >
      <IconButton
        variant='ghost'
        size='md'
        borderRadius='full'
        aria-label='Open menu'
      >
        <BiDotsVerticalRounded />
      </IconButton>
    </DropdownMenuComp>
  );
};
