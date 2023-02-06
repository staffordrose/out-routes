import { RouteFeatures } from '@/xata';

export type RouteFeature = RouteFeatures;

export type PartialRouteFeature = Pick<RouteFeature, 'id'> &
  Partial<RouteFeature>;

export type RouteFeatureImageIdUrls = Pick<
  RouteFeature,
  | 'image_id'
  | 'image_full'
  | 'image_large'
  | 'image_card_banner'
  | 'image_thumb_360'
  | 'image_thumb_240'
  | 'image_thumb_120'
>;
