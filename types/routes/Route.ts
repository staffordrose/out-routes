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

export enum StaticImageNames {
  OG = 'og',
  CARD_BANNER = 'card_banner',
  THUMB_360 = 'thumb_360',
  THUMB_240 = 'thumb_240',
  THUMB_120 = 'thumb_120',
}

export type RouteStaticImageUrls = Pick<
  Route,
  | 'static_image_og'
  | 'static_image_card_banner'
  | 'static_image_thumb_360'
  | 'static_image_thumb_240'
  | 'static_image_thumb_120'
>;

export type StaticImage = {
  name: StaticImageNames;
  width: number;
  height: number;
} & (
  | {
      contentType?: never;
      content: Buffer;
    }
  | {
      contentType: string | null;
      content: File;
    }
);
