import { FC, ReactNode } from 'react';
import { BiCheck, BiUser } from 'react-icons/bi';

import {
  AspectRatio,
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  Link,
  Text,
  TruncatedText,
} from '@/components/atoms';
import { Card } from '@/components/molecules';
import { User } from '@/types/users';

export type UserCardProps = {
  name: User['name'];
  username: User['username'];
  bio?: User['bio'];
  stats_followers?: User['stats_followers'];
  showFollowBtn?: boolean;
  isFollowing?: boolean;
  handleFollow?: () => void;
  onNavigate?: () => void;
  children?: ReactNode;
} & (
  | {
      orientation: 'horizontal';
      image?: User['image_thumb_64'];
    }
  | {
      orientation: 'vertical';
      image?: User['image_thumb_120'];
    }
);

export const UserCard: FC<UserCardProps> = ({
  orientation = 'vertical',
  image,
  name,
  username,
  bio,
  stats_followers,
  showFollowBtn,
  isFollowing,
  handleFollow,
  onNavigate,
  children,
}) => {
  return (
    <Card orientation={orientation}>
      <Card.Image bg='none'>
        {orientation === 'vertical' ? (
          <Box css={{ paddingTop: '$4', paddingLeft: '$4' }}>
            <Avatar
              size='md'
              src={image || undefined}
              firstName={name?.split(' ')[0]}
              lastName={name?.split(' ')[1]}
            />
          </Box>
        ) : (
          <AspectRatio ratio={1}>
            <Center width='full' height='full'>
              <Avatar
                size='lg'
                src={image || undefined}
                firstName={name?.split(' ')[0]}
                lastName={name?.split(' ')[1]}
              />
            </Center>
          </AspectRatio>
        )}
      </Card.Image>
      <Card.Body gap='md' width='full' height='full'>
        <Flex
          direction={orientation === 'vertical' ? 'column' : 'row'}
          gap='md'
          justifyContent='space-between'
          alignItems={orientation === 'vertical' ? 'flex-start' : 'center'}
          width='full'
          height='full'
        >
          <Flex direction='column' gap='md' width='full'>
            <div>
              <Link
                href={`/${username}`}
                onClick={() => {
                  if (typeof onNavigate === 'function') {
                    onNavigate();
                  }
                }}
              >
                <TruncatedText as='h5'>{name}</TruncatedText>
              </Link>
              <span>@{username}</span>
            </div>
            {orientation === 'vertical' && (
              <TruncatedText lineClamp={2}>{bio}</TruncatedText>
            )}
            {children}
          </Flex>
          <Flex gap='sm'>
            {showFollowBtn && typeof handleFollow === 'function' ? (
              <Button
                variant={isFollowing ? 'outline' : 'solid'}
                size='sm'
                onClick={handleFollow}
              >
                {isFollowing ? <BiCheck /> : <BiUser />}
                {orientation === 'vertical' ? (
                  <>
                    <span>{Number(stats_followers) || 0}</span>{' '}
                    <span>
                      Follower{Number(stats_followers) !== 1 ? `s` : ``}
                    </span>
                  </>
                ) : (
                  <span>{Number(stats_followers) || 0}</span>
                )}
              </Button>
            ) : (
              <Flex display='inline-flex' gap='xs' placeItems='center'>
                <BiUser />
                {orientation === 'vertical' ? (
                  <Text
                    as='span'
                    fontFamily='heading'
                    fontSize='md'
                    fontWeight='medium'
                  >
                    <span>{Number(stats_followers) || 0}</span>{' '}
                    <span>
                      Follower{Number(stats_followers) !== 1 ? `s` : ``}
                    </span>
                  </Text>
                ) : (
                  <Text
                    as='span'
                    fontFamily='heading'
                    fontSize='md'
                    fontWeight='medium'
                  >
                    {Number(stats_followers) || 0}
                  </Text>
                )}
              </Flex>
            )}
          </Flex>
        </Flex>
      </Card.Body>
    </Card>
  );
};
