import { CountryCodes } from '@/data/general';
import { ActivityTypes } from '@/data/routes';

export type RouteSettingsFormValues = {
  is_private: 'private' | 'public';
  title: string;
  title_alt: Array<{ text: string }>;
  activity_type: ActivityTypes | undefined;
  region: string;
  country: CountryCodes | undefined;
};
