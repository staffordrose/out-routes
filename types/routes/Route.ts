import { Routes } from '@/xata';

export type Route = Routes;

export type PartialRoute = Pick<Routes, 'id' | 'is_private'> & Partial<Routes>;

export type RouteImageIdUrls = Pick<
  Route,
  | 'image_id'
  | 'image_full'
  | 'image_og'
  | 'image_banner'
  | 'image_card_banner'
  | 'image_thumb_360'
  | 'image_thumb_240'
  | 'image_thumb_120'
>;
