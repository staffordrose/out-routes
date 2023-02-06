import { roundToDecimalCount } from './roundToDecimalCount';

export const sqMetersToAcres = (sqm: number): number => {
  return roundToDecimalCount(sqm * 0.000247105, { decimalCount: 3 });
};
