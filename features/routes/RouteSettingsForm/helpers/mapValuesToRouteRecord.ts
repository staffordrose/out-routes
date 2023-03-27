import { Route } from '@/types/routes';
import { RouteSettingsFormValues } from './types';

export const mapValuesToRouteRecord = (
  values: RouteSettingsFormValues
): Partial<Route> => {
  const { is_private, title, title_alt, activity_type, region, country } =
    values;

  const route = {
    is_private: is_private === 'private' ? true : false,
    title,
    title_alt: Array.isArray(title_alt)
      ? title_alt.map(({ text }) => text)
      : [],
    activity_type,
    region,
    country,
  };

  return route;
};
