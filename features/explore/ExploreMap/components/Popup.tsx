import { FC } from 'react';
import { BiImageAlt, BiLock, BiStar } from 'react-icons/bi';

import {
  AspectRatio,
  Center,
  Chip,
  Flex,
  Image,
  Link,
  Text,
} from '@/components/atoms';
import { Card } from '@/components/molecules';
import { LngLat } from '@/types/maps';
import { Route } from '@/types/routes';

export type PopupState = {
  center: LngLat;
  route: Route;
};

type PopupProps = {
  route: Route;
};

export const Popup: FC<PopupProps> = ({ route }) => {
  const { owner, is_private, slug, title, image_card_banner, stats_favorites } =
    route;

  const { username } = owner || {};

  return (
    <>
      <Card.Image>
        <AspectRatio ratio={16 / 9}>
          {image_card_banner ? (
            <Image
              fill
              sizes='360px'
              src={image_card_banner}
              alt={title || ''}
            />
          ) : (
            <Center width='full' height='full'>
              <BiImageAlt size='3rem' />
            </Center>
          )}
        </AspectRatio>
      </Card.Image>
      <Card.Body
        direction='column'
        gap='md'
        justifyContent='space-between'
        alignItems='center'
        width='full'
        height='full'
      >
        <Flex gap='md' alignItems='center'>
          <Link href={`/${username}/${slug}`}>
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
          <Flex display='inline-flex' gap='xs' placeItems='center'>
            <BiStar />

            <Text
              as='span'
              fontFamily='heading'
              fontSize='md'
              fontWeight='medium'
            >
              <span>{Number(stats_favorites) || 0}</span>{' '}
              <span>Star{Number(stats_favorites) !== 1 ? `s` : ``}</span>
            </Text>
          </Flex>
        </Flex>
      </Card.Body>
    </>
  );
};
