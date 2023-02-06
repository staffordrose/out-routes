import { roundToDecimalCount } from './roundToDecimalCount';

export const metersToFeet = (meters: number): number => {
  return roundToDecimalCount(meters * 3.2808399, { decimalCount: 3 });
};
