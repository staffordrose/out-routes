import { round } from './round';

export const kilometersToMiles = (km: number): number => {
  return round(km * 0.621371, 3);
};
