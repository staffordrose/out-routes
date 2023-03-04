import { FC } from 'react';
import { BiCalendarAlt } from 'react-icons/bi';

import { Avatar, Flex, IconButtonLink, Link, Text } from '@/components/atoms';
import { Card, HoverCard } from '@/components/molecules';
import { Commit, Route, User } from '@/types';
import { displayDate } from '@/utils';
import { UserCard } from '../users';

export type CommitCardProps = {
  orientation: 'horizontal' | 'vertical';
  username: User['username'];
  slug: Route['slug'];
  id: Commit['id'];
  created_at: Commit['created_at'];
  title: Commit['title'];
  user: Commit['user'];
  onNavigate?: () => void;
};

export const CommitCard: FC<CommitCardProps> = ({
  orientation,
  username,
  slug,
  id,
  title,
  user,
  created_at,
  onNavigate,
}) => {
  return (
    <Card orientation={orientation}>
      <Card.Body
        gap='md'
        justifyContent='space-between'
        alignItems='center'
        width='full'
        height='full'
      >
        <Flex direction='column' gap='xs' alignItems='flex-start'>
          <Link
            href={`/${username}/${slug}/history/${id}`}
            onClick={() => {
              if (typeof onNavigate === 'function') {
                onNavigate();
              }
            }}
          >
            <h3>{title || `[Untitled entry]`}</h3>
          </Link>
          <Flex gap='xs' alignItems='center'>
            <BiCalendarAlt />
            <Text fontSize='sm'>{displayDate(created_at || '')}</Text>
          </Flex>
        </Flex>
        {!!user && (
          <HoverCard
            key={id}
            card={
              <UserCard
                orientation='vertical'
                image={user.image_thumb_120}
                name={user.name}
                username={user.username}
                bio={user.bio}
                stats_followers={user.stats_followers}
              />
            }
          >
            <IconButtonLink
              variant='ghost'
              size='sm'
              borderRadius='full'
              aria-label={`View ${user.name}'s profile`}
              href={`/${username}`}
            >
              <Avatar
                size='xs'
                src={user.image_thumb_32 || undefined}
                firstName={user.name?.split(' ')[0]}
                lastName={user.name?.split(' ')[1]}
              />
            </IconButtonLink>
          </HoverCard>
        )}
      </Card.Body>
    </Card>
  );
};
