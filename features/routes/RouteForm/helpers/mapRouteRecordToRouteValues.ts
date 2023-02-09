import { Route } from '@/types';
import { RouteValues } from './types';

export const mapRouteRecordToRouteValues = (route: Route): RouteValues => {
  return {
    files: [] as RouteValues['files'],
    id: route.id,
    owner: {
      id: route.owner?.id || '',
      username: route.owner?.username || '',
    },
    is_private: route.is_private ? 'private' : 'public',
    title: route.title || '',
    title_alt: Array.isArray(route.title_alt)
      ? route.title_alt.map((t) => ({ text: t }))
      : [],
    activity_type: (route.activity_type || '') as RouteValues['activity_type'],
    region: route.region || '',
    country: (route.country || '') as RouteValues['country'],
    image_id: route.image_id || null,
    image_full: route.image_full || null,
    image_og: route.image_og || null,
    image_banner: route.image_banner || null,
    image_card_banner: route.image_card_banner || null,
    image_thumb_360: route.image_thumb_360 || null,
    image_thumb_240: route.image_thumb_240 || null,
    image_thumb_120: route.image_thumb_120 || null,
  };
};
