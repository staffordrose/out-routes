import {
  nonStandardColorCodes,
  NonStandardColorCodes,
  nonStandardColorLabels,
  NonStandardColorLabels,
  nonStandardColorNames,
  NonStandardColorNames,
} from './nonStandardColors';
import {
  standardColorCodes,
  StandardColorCodes,
  standardColorLabels,
  StandardColorLabels,
  standardColorNames,
  StandardColorNames,
} from './standardColors';

export * from './nonStandardColors';
export * from './standardColors';

export type ColorCodes = StandardColorCodes | NonStandardColorCodes;

export type ColorNames = StandardColorNames | NonStandardColorNames;

export type ColorLabels = StandardColorLabels | NonStandardColorLabels;

export const colorCodes: Record<ColorNames, ColorCodes> = {
  ...standardColorCodes,
  ...nonStandardColorCodes,
};

export const colorNames: Record<ColorCodes, ColorNames> = {
  ...standardColorNames,
  ...nonStandardColorNames,
};

export const colorLabels: Record<ColorNames, ColorLabels> = {
  ...standardColorLabels,
  ...nonStandardColorLabels,
};

export const colorSelectOptions: Array<{
  value: ColorNames;
  label: ColorLabels;
}> = (Object.entries(colorLabels) as Array<[ColorNames, ColorLabels]>).map(
  (c) => ({
    value: c[0],
    label: c[1],
  })
);
