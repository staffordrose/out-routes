import { round } from './round';

export const sqMetersToAcres = (sqm: number): number => {
  return round(sqm * 0.000247105, 3);
};
