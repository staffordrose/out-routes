import { FC, ReactNode } from 'react';
import type { IconType } from 'react-icons';
import {
  BiBody,
  BiCalendarAlt,
  BiCodeAlt,
  BiCurrentLocation,
  BiGitRepoForked,
  BiHistory,
  BiInfoSquare,
  BiLock,
  BiLockOpen,
  BiStar,
  BiUser,
  BiUserCheck,
  BiWorld,
} from 'react-icons/bi';

import {
  Box,
  Flex,
  Icon,
  Link,
  List,
  Separator,
  Text,
} from '@/components/atoms';
import { Feedback } from '@/components/layout';
import { countries, CountryCodes } from '@/data/general';
import { ActivityTypes, activityTypes } from '@/data/routes';
import { styled } from '@/styles';
import { Route, User } from '@/types';
import { displayDate } from '@/utils';
import { RouteContributors } from './RouteContributors';

type RouteDetailsProps = {
  username: User['username'];
  route: Route;
};

export const RouteDetails: FC<RouteDetailsProps> = ({ username, route }) => {
  const {
    updated_at,
    is_private,
    title_alt,
    activity_type,
    region,
    country,
    stats_commits,
    stats_favorites,
    stats_forks,
    stats_members,
    stats_contributors,
  } = route;

  return (
    <StyledRouteDetails>
      <div>
        <List as='ul' direction='column' width='full' marginBottom='md'>
          {Array.isArray(title_alt) && title_alt.length > 0 && (
            <Detail icon={BiInfoSquare}>
              <Text
                as='span'
                fontWeight='medium'
                style={{ fontStyle: 'italic' }}
              >
                AKA:
              </Text>{' '}
              <span>{title_alt.join(', ')}</span>
            </Detail>
          )}
          <Detail icon={BiBody}>
            {activity_type
              ? activityTypes[activity_type as ActivityTypes]
              : null}
          </Detail>
          <Detail icon={BiCurrentLocation}>{region}</Detail>
          <Detail icon={BiWorld}>
            {country ? countries[country as CountryCodes] : null}
          </Detail>
        </List>
        <h2>Description</h2>
        <Feedback size='sm' type='empty' icon={BiCodeAlt} title='Coming Soon'>
          Route descriptions are coming soon!
        </Feedback>
      </div>
      <Flex direction='column' gap='lg' width='full'>
        <BorderBox>
          <h2>Summary</h2>
          <List as='ul' direction='column' width='full'>
            <Detail separator icon={is_private ? BiLock : BiLockOpen}>
              {is_private ? 'Private' : 'Public'}
            </Detail>
            <DetailLink
              separator
              href={`/${username}/${route.slug}/history`}
              icon={BiHistory}
            >
              {Number(stats_commits) || 0} Edit
              {(Number(stats_commits) || 0) === 1 ? `` : `s`}
            </DetailLink>
            <DetailLink
              separator
              href={`/${username}/${route.slug}/contributors`}
              icon={BiUser}
            >
              {Number(stats_contributors) || 0} Contributor
              {(Number(stats_contributors) || 0) === 1 ? `` : `s`}
            </DetailLink>
            <Detail separator icon={BiUserCheck}>
              {Number(stats_members) || 0} Member
              {(Number(stats_members) || 0) === 1 ? `` : `s`}
            </Detail>
            <Detail separator icon={BiStar}>
              {Number(stats_favorites) || 0} Star
              {(Number(stats_favorites) || 0) === 1 ? `` : `s`}
            </Detail>
            <Detail separator icon={BiGitRepoForked}>
              {Number(stats_forks) || 0} Fork
              {(Number(stats_forks) || 0) === 1 ? `` : `s`}
            </Detail>
            <Detail icon={BiCalendarAlt}>
              {updated_at ? displayDate(updated_at) : null}
            </Detail>
          </List>
        </BorderBox>
        <BorderBox>
          <RouteContributors username={username} slug={route.slug} />
        </BorderBox>
      </Flex>
    </StyledRouteDetails>
  );
};

const StyledRouteDetails = styled('div', {
  display: 'grid',
  gap: '$4',
  width: '$full',
  '@md': {
    gridTemplateColumns: '1fr $48',
  },
  '@lg': {
    gridTemplateColumns: '1fr $64',
  },
});

const BorderBox = styled('div', {
  paddingX: '$4',
  paddingY: '$3_5',
  borderWidth: '$2',
  borderStyle: 'dashed',
  borderColor: '$slate-200',
  borderRadius: '$xl',
});

type DetailProps = {
  separator?: boolean;
  icon: IconType;
  children: ReactNode;
};

const Detail: FC<DetailProps> = ({ separator, icon, children }) => {
  return (
    <Box as='li'>
      <Flex gap='sm' alignItems='center' css={{ paddingY: '$1' }}>
        <Icon as={icon} size='sm' />
        <Text fontFamily='heading' lineHeight='xs'>
          {children}
        </Text>
      </Flex>
      {separator && <Separator width='full' height='xs' colorScale={200} />}
    </Box>
  );
};

type DetailLinkProps = {
  separator?: boolean;
  href: string;
  icon: IconType;
  children: ReactNode;
};

const DetailLink: FC<DetailLinkProps> = ({
  separator,
  href,
  icon,
  children,
}) => {
  return (
    <Box as='li'>
      <Flex gap='sm' alignItems='center' css={{ paddingY: '$1' }}>
        <Icon as={icon} size='sm' />
        <Link href={href}>
          <Text fontFamily='heading' lineHeight='xs'>
            {children}
          </Text>
        </Link>
      </Flex>
      {separator && <Separator width='full' height='xs' colorScale={200} />}
    </Box>
  );
};
