import { roundToDecimalCount } from './roundToDecimalCount';

export const feetToMeters = (feet: number): number => {
  return roundToDecimalCount(feet * 0.3048, { decimalCount: 3 });
};
