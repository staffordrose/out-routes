import { FC } from 'react';
import { BiCheck, BiImageAlt, BiLock, BiStar } from 'react-icons/bi';

import {
  AspectRatio,
  Button,
  Center,
  Chip,
  Flex,
  Image,
  Link,
  Text,
} from '@/components/atoms';
import { Card } from '@/components/molecules';
import { Route, User } from '@/types';

export type RouteCardProps = {
  is_private: Route['is_private'];
  username: User['username'];
  slug: Route['slug'];
  title: Route['title'];
  stats_favorites?: Route['stats_favorites'];
  showFavoriteBtn?: boolean;
  isFavorited?: boolean;
  handleFavorite?: () => void;
  onNavigate?: () => void;
} & (
  | {
      orientation: 'horizontal';
      image?: Route['image_thumb_120'];
    }
  | {
      orientation: 'vertical';
      image?: Route['image_card_banner'];
    }
);

export const RouteCard: FC<RouteCardProps> = ({
  orientation,
  image,
  username,
  slug,
  title,
  is_private,
  stats_favorites,
  showFavoriteBtn,
  isFavorited,
  handleFavorite,
  onNavigate,
}) => {
  return (
    <Card orientation={orientation}>
      <Card.Image>
        {orientation === 'vertical' ? (
          <AspectRatio ratio={16 / 9}>
            {image ? (
              <Image fill sizes='360px' src={image} alt={title || ''} />
            ) : (
              <Center width='full' height='full'>
                <BiImageAlt size='3rem' />
              </Center>
            )}
          </AspectRatio>
        ) : (
          <AspectRatio ratio={1}>
            {image ? (
              <Image fill sizes='90px' src={image} alt={title || ''} />
            ) : (
              <Center width='full' height='full'>
                <BiImageAlt size='1.5rem' />
              </Center>
            )}
          </AspectRatio>
        )}
      </Card.Image>
      <Card.Body
        gap='md'
        justifyContent='space-between'
        alignItems='center'
        width='full'
        height='full'
      >
        <Flex gap='md' alignItems='center'>
          <Link
            variant='solid'
            href={`/${username}/${slug}`}
            onClick={() => {
              if (typeof onNavigate === 'function') {
                onNavigate();
              }
            }}
          >
            <h5>{title}</h5>
          </Link>
          {is_private && (
            <Chip>
              <BiLock />
              <span>Private</span>
            </Chip>
          )}
        </Flex>
        <Flex direction='column' gap='sm'>
          {showFavoriteBtn && typeof handleFavorite === 'function' ? (
            <Button
              variant={isFavorited ? 'outline' : 'solid'}
              size='sm'
              onClick={handleFavorite}
            >
              {isFavorited ? <BiCheck /> : <BiStar />}
              {orientation === 'vertical' ? (
                <>
                  <span>{Number(stats_favorites) || 0}</span>{' '}
                  <span>Star{Number(stats_favorites) !== 1 ? `s` : ``}</span>
                </>
              ) : (
                <span>{Number(stats_favorites) || 0}</span>
              )}
            </Button>
          ) : (
            <Flex display='inline-flex' gap='xs' placeItems='center'>
              <BiStar />
              {orientation === 'vertical' ? (
                <Text
                  as='span'
                  fontFamily='heading'
                  fontSize='md'
                  fontWeight='medium'
                >
                  <span>{Number(stats_favorites) || 0}</span>{' '}
                  <span>Star{Number(stats_favorites) !== 1 ? `s` : ``}</span>
                </Text>
              ) : (
                <Text
                  as='span'
                  fontFamily='heading'
                  fontSize='md'
                  fontWeight='medium'
                >
                  {Number(stats_favorites) || 0}
                </Text>
              )}
            </Flex>
          )}
        </Flex>
      </Card.Body>
    </Card>
  );
};
