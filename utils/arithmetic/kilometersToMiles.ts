import { roundToDecimalCount } from './roundToDecimalCount';

export const kilometersToMiles = (km: number): number => {
  return roundToDecimalCount(km * 0.621371, { decimalCount: 3 });
};
