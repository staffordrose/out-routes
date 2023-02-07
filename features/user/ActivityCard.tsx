import { FC } from 'react';
import { BiTime } from 'react-icons/bi';

import { Flex, Link, Text } from '@/components/atoms';
import { ActivityActions } from '@/data/activity';
import { styled } from '@/styles';
import { Activity } from '@/types';
import { displayRelativeTime, isJsonString } from '@/utils';
import { RouteCard } from '../routes';
import { UserCard } from '../users';

type ActivityCardProps = {
  activity: Activity;
};

export const ActivityCard: FC<ActivityCardProps> = ({ activity }) => {
  const { created_at, creator, action, payload } = activity;

  const creatorUsername = creator?.username;
  const creatorName = creator?.name || `@${creatorUsername}`;

  const data = isJsonString(payload || '') ? JSON.parse(payload || '') : {};

  switch (action) {
    case ActivityActions.FOLLOW_USER: {
      const { username, name, bio, image_thumb_120, stats_followers } =
        data.followed;

      return (
        <StyledActivityCard>
          <Flex gap='xs' alignItems='center'>
            <BiTime />
            <Text fontSize='sm' color='slate-700'>
              {displayRelativeTime(created_at || '')}
            </Text>
          </Flex>
          <p>{creatorName} began following:</p>
          <UserCard
            orientation='vertical'
            image={image_thumb_120}
            name={name}
            username={username}
            bio={bio}
            stats_followers={stats_followers}
          />
        </StyledActivityCard>
      );
    }
    case ActivityActions.FAVORITE_ROUTE: {
      const {
        owner,
        is_private,
        slug,
        title,
        image_card_banner,
        stats_favorites,
      } = data.route;

      return (
        <StyledActivityCard>
          <Flex gap='xs' alignItems='center'>
            <BiTime />
            <Text fontSize='sm' color='slate-700'>
              {displayRelativeTime(created_at || '')}
            </Text>
          </Flex>
          <p>{creatorName} starred a route:</p>
          <RouteCard
            orientation='vertical'
            image={image_card_banner}
            username={owner?.username}
            slug={slug}
            is_private={is_private}
            title={title}
            stats_favorites={stats_favorites}
            showFavoriteBtn={false}
          />
        </StyledActivityCard>
      );
    }
    case ActivityActions.ADD_ROUTE:
    case ActivityActions.FORK_ROUTE:
    case ActivityActions.UPDATE_ROUTE: {
      const {
        owner,
        is_private,
        slug,
        title,
        image_card_banner,
        stats_favorites,
      } = data;

      return (
        <StyledActivityCard>
          <Flex gap='xs' alignItems='center'>
            <BiTime />
            <Text fontSize='sm' color='slate-700'>
              {displayRelativeTime(created_at || '')}
            </Text>
          </Flex>
          <p>
            <Link href={`/${creatorUsername}`}>{creatorName}</Link>{' '}
            {action === ActivityActions.ADD_ROUTE
              ? `added a new route`
              : action === ActivityActions.FORK_ROUTE
              ? `forked a route`
              : `updated a route`}
            :
          </p>
          <RouteCard
            orientation='vertical'
            image={image_card_banner}
            username={owner?.username}
            slug={slug}
            is_private={is_private}
            title={title}
            stats_favorites={stats_favorites}
            showFavoriteBtn={false}
          />
        </StyledActivityCard>
      );
    }
    default:
      return null;
  }
};

const StyledActivityCard = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$2',
  padding: '$4',
});
