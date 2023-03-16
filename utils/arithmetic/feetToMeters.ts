import { round } from './round';

export const feetToMeters = (feet: number): number => {
  return round(feet * 0.3048, 3);
};
