export enum NonStandardColorCodes {
  Pink = '#FFC0CB',
  DeepPink = '#FF1493',
  OrangeRed = '#FF4500',
  Orange = '#FFA500',
  Gold = '#FFD700',
  Violet = '#EE82EE',
  DarkViolet = '#9400D3',
  Chartreuse = '#7FFF00',
  LimeGreen = '#32CD32',
  Teal = '#008080',
  SkyBlue = '#87CEEB',
  Goldenrod = '#DAA520',
  Chocolate = '#D2691E',
  Brown = '#A52A2A',
  Maroon = '#800000',
}

export enum NonStandardColorNames {
  Pink = 'Pink',
  DeepPink = 'DeepPink',
  OrangeRed = 'OrangeRed',
  Orange = 'Orange',
  Gold = 'Gold',
  Violet = 'Violet',
  DarkViolet = 'DarkViolet',
  Chartreuse = 'Chartreuse',
  LimeGreen = 'LimeGreen',
  Teal = 'Teal',
  SkyBlue = 'SkyBlue',
  Goldenrod = 'Goldenrod',
  Chocolate = 'Chocolate',
  Brown = 'Brown',
  Maroon = 'Maroon',
}

export enum NonStandardColorLabels {
  Pink = 'Pink',
  DeepPink = 'Deep Pink',
  OrangeRed = 'Orange Red',
  Orange = 'Orange',
  Gold = 'Gold',
  Violet = 'Violet',
  DarkViolet = 'Dark Violet',
  Chartreuse = 'Chartreuse',
  LimeGreen = 'Lime Green',
  Teal = 'Teal',
  SkyBlue = 'Sky Blue',
  Goldenrod = 'Goldenrod',
  Chocolate = 'Chocolate',
  Brown = 'Brown',
  Maroon = 'Maroon',
}

export const nonStandardColorCodes: Record<
  NonStandardColorNames,
  NonStandardColorCodes
> = {
  [NonStandardColorNames.Pink]: NonStandardColorCodes.Pink,
  [NonStandardColorNames.DeepPink]: NonStandardColorCodes.DeepPink,
  [NonStandardColorNames.OrangeRed]: NonStandardColorCodes.OrangeRed,
  [NonStandardColorNames.Orange]: NonStandardColorCodes.Orange,
  [NonStandardColorNames.Gold]: NonStandardColorCodes.Gold,
  [NonStandardColorNames.Violet]: NonStandardColorCodes.Violet,
  [NonStandardColorNames.DarkViolet]: NonStandardColorCodes.DarkViolet,
  [NonStandardColorNames.Chartreuse]: NonStandardColorCodes.Chartreuse,
  [NonStandardColorNames.LimeGreen]: NonStandardColorCodes.LimeGreen,
  [NonStandardColorNames.Teal]: NonStandardColorCodes.Teal,
  [NonStandardColorNames.SkyBlue]: NonStandardColorCodes.SkyBlue,
  [NonStandardColorNames.Goldenrod]: NonStandardColorCodes.Goldenrod,
  [NonStandardColorNames.Chocolate]: NonStandardColorCodes.Chocolate,
  [NonStandardColorNames.Brown]: NonStandardColorCodes.Brown,
  [NonStandardColorNames.Maroon]: NonStandardColorCodes.Maroon,
};

export const nonStandardColorNames: Record<
  NonStandardColorCodes,
  NonStandardColorNames
> = {
  [NonStandardColorCodes.Pink]: NonStandardColorNames.Pink,
  [NonStandardColorCodes.DeepPink]: NonStandardColorNames.DeepPink,
  [NonStandardColorCodes.OrangeRed]: NonStandardColorNames.OrangeRed,
  [NonStandardColorCodes.Orange]: NonStandardColorNames.Orange,
  [NonStandardColorCodes.Gold]: NonStandardColorNames.Gold,
  [NonStandardColorCodes.Violet]: NonStandardColorNames.Violet,
  [NonStandardColorCodes.DarkViolet]: NonStandardColorNames.DarkViolet,
  [NonStandardColorCodes.Chartreuse]: NonStandardColorNames.Chartreuse,
  [NonStandardColorCodes.LimeGreen]: NonStandardColorNames.LimeGreen,
  [NonStandardColorCodes.Teal]: NonStandardColorNames.Teal,
  [NonStandardColorCodes.SkyBlue]: NonStandardColorNames.SkyBlue,
  [NonStandardColorCodes.Goldenrod]: NonStandardColorNames.Goldenrod,
  [NonStandardColorCodes.Chocolate]: NonStandardColorNames.Chocolate,
  [NonStandardColorCodes.Brown]: NonStandardColorNames.Brown,
  [NonStandardColorCodes.Maroon]: NonStandardColorNames.Maroon,
};

export const nonStandardColorLabels: Record<
  NonStandardColorNames,
  NonStandardColorLabels
> = {
  [NonStandardColorNames.Pink]: NonStandardColorLabels.Pink,
  [NonStandardColorNames.DeepPink]: NonStandardColorLabels.DeepPink,
  [NonStandardColorNames.OrangeRed]: NonStandardColorLabels.OrangeRed,
  [NonStandardColorNames.Orange]: NonStandardColorLabels.Orange,
  [NonStandardColorNames.Gold]: NonStandardColorLabels.Gold,
  [NonStandardColorNames.Violet]: NonStandardColorLabels.Violet,
  [NonStandardColorNames.DarkViolet]: NonStandardColorLabels.DarkViolet,
  [NonStandardColorNames.Chartreuse]: NonStandardColorLabels.Chartreuse,
  [NonStandardColorNames.LimeGreen]: NonStandardColorLabels.LimeGreen,
  [NonStandardColorNames.Teal]: NonStandardColorLabels.Teal,
  [NonStandardColorNames.SkyBlue]: NonStandardColorLabels.SkyBlue,
  [NonStandardColorNames.Goldenrod]: NonStandardColorLabels.Goldenrod,
  [NonStandardColorNames.Chocolate]: NonStandardColorLabels.Chocolate,
  [NonStandardColorNames.Brown]: NonStandardColorLabels.Brown,
  [NonStandardColorNames.Maroon]: NonStandardColorLabels.Maroon,
};

export const nonStandardColorSelectOptions: Array<{
  value: NonStandardColorNames;
  label: NonStandardColorLabels;
}> = (
  Object.entries(nonStandardColorLabels) as Array<
    [NonStandardColorNames, NonStandardColorLabels]
  >
).map((c) => ({
  value: c[0],
  label: c[1],
}));
