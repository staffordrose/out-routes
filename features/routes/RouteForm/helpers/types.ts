import { CountryCodes } from '@/data/general';
import { ActivityTypes } from '@/data/routes';
import { MapFeature } from '@/types/maps';
import { Route, RouteFeature, RouteLayer } from '@/types/routes';
import { User } from '@/types/users';

export type RouteValues = {
  files: File[];
  id: string;
  owner: Pick<User, 'id' | 'username'>;
  is_private: 'private' | 'public';
  title: string;
  title_alt: Array<{ text: string }>;
  activity_type: ActivityTypes | undefined;
  region: string;
  country: CountryCodes | undefined;
  summary: string;
  image_id: string | null;
  image_full: string | null;
  image_og: string | null;
  image_banner: string | null;
  image_card_banner: string | null;
  image_thumb_360: string | null;
  image_thumb_240: string | null;
  image_thumb_120: string | null;
};

export type LayerValues = {
  databaseId?: string;
  title: string;
  color: string;
  symbol: string;
  features?: FeatureValues[];
};

export type LayerStore = {
  databaseId?: string;
  title: string;
  color: string;
  symbol: string;
  features?: Map<MapFeature['id'], FeatureValues>;
};

export type FeatureValues = {
  databaseId?: string;
  files: File[];
  type: string;
  coordinates: { lat: string; lng: string }[];
  title: string;
  color: string | undefined;
  symbol: string | undefined;
  description: string;
  ele_start: number;
  ele_end: number;
  distance: number;
  area: number;
  image_id: string | null;
  image_full: string | null;
  image_large: string | null;
  image_card_banner: string | null;
  image_thumb_360: string | null;
  image_thumb_240: string | null;
  image_thumb_120: string | null;
};

export type RouteFormValues = {
  route: RouteValues;
  layers: LayerValues[];
  activeLayerId: RouteLayer['id'] | null;
};

export type RouteFormResult = {
  route: Route & { files: File[] };
  layers: RouteLayer[];
  features: RouteFeature[];
};
