import { round } from './round';

export const metersToFeet = (meters: number): number => {
  return round(meters * 3.2808399, 3);
};
