export enum StandardColorCodes {
  Black = '#000000',
  DarkRed = '#8B0000',
  DarkGreen = '#006400',
  DarkYellow = '#999900',
  DarkBlue = '#00008B',
  DarkMagenta = '#8B008B',
  DarkCyan = '#008B8B',
  LightGray = '#D3D3D3',
  DarkGray = '#696969',
  Red = '#FF0000',
  Green = '#008000',
  Yellow = '#FFFF00',
  Blue = '#0000FF',
  Magenta = '#FF00FF',
  Cyan = '#00FFFF',
  White = '#FFFFFF',
  Transparent = 'transparent',
}

export enum StandardColorNames {
  Black = 'Black',
  DarkRed = 'DarkRed',
  DarkGreen = 'DarkGreen',
  DarkYellow = 'DarkYellow',
  DarkBlue = 'DarkBlue',
  DarkMagenta = 'DarkMagenta',
  DarkCyan = 'DarkCyan',
  LightGray = 'LightGray',
  DarkGray = 'DarkGray',
  Red = 'Red',
  Green = 'Green',
  Yellow = 'Yellow',
  Blue = 'Blue',
  Magenta = 'Magenta',
  Cyan = 'Cyan',
  White = 'White',
  Transparent = 'Transparent',
}

export enum StandardColorLabels {
  Black = 'Black',
  DarkRed = 'Dark Red',
  DarkGreen = 'Dark Green',
  DarkYellow = 'Dark Yellow',
  DarkBlue = 'Dark Blue',
  DarkMagenta = 'Dark Magenta',
  DarkCyan = 'Dark Cyan',
  LightGray = 'Light Gray',
  DarkGray = 'Dark Gray',
  Red = 'Red',
  Green = 'Green',
  Yellow = 'Yellow',
  Blue = 'Blue',
  Magenta = 'Magenta',
  Cyan = 'Cyan',
  White = 'White',
  Transparent = 'Transparent',
}

export const standardColorCodes: Record<
  StandardColorNames,
  StandardColorCodes
> = {
  [StandardColorNames.Black]: StandardColorCodes.Black,
  [StandardColorNames.DarkRed]: StandardColorCodes.DarkRed,
  [StandardColorNames.DarkGreen]: StandardColorCodes.DarkGreen,
  [StandardColorNames.DarkYellow]: StandardColorCodes.DarkYellow,
  [StandardColorNames.DarkBlue]: StandardColorCodes.DarkBlue,
  [StandardColorNames.DarkMagenta]: StandardColorCodes.DarkMagenta,
  [StandardColorNames.DarkCyan]: StandardColorCodes.DarkCyan,
  [StandardColorNames.LightGray]: StandardColorCodes.LightGray,
  [StandardColorNames.DarkGray]: StandardColorCodes.DarkGray,
  [StandardColorNames.Red]: StandardColorCodes.Red,
  [StandardColorNames.Green]: StandardColorCodes.Green,
  [StandardColorNames.Yellow]: StandardColorCodes.Yellow,
  [StandardColorNames.Blue]: StandardColorCodes.Blue,
  [StandardColorNames.Magenta]: StandardColorCodes.Magenta,
  [StandardColorNames.Cyan]: StandardColorCodes.Cyan,
  [StandardColorNames.White]: StandardColorCodes.White,
  [StandardColorNames.Transparent]: StandardColorCodes.Transparent,
};

export const standardColorNames: Record<
  StandardColorCodes,
  StandardColorNames
> = {
  [StandardColorCodes.Black]: StandardColorNames.Black,
  [StandardColorCodes.DarkRed]: StandardColorNames.DarkRed,
  [StandardColorCodes.DarkGreen]: StandardColorNames.DarkGreen,
  [StandardColorCodes.DarkYellow]: StandardColorNames.DarkYellow,
  [StandardColorCodes.DarkBlue]: StandardColorNames.DarkBlue,
  [StandardColorCodes.DarkMagenta]: StandardColorNames.DarkMagenta,
  [StandardColorCodes.DarkCyan]: StandardColorNames.DarkCyan,
  [StandardColorCodes.LightGray]: StandardColorNames.LightGray,
  [StandardColorCodes.DarkGray]: StandardColorNames.DarkGray,
  [StandardColorCodes.Red]: StandardColorNames.Red,
  [StandardColorCodes.Green]: StandardColorNames.Green,
  [StandardColorCodes.Yellow]: StandardColorNames.Yellow,
  [StandardColorCodes.Blue]: StandardColorNames.Blue,
  [StandardColorCodes.Magenta]: StandardColorNames.Magenta,
  [StandardColorCodes.Cyan]: StandardColorNames.Cyan,
  [StandardColorCodes.White]: StandardColorNames.White,
  [StandardColorCodes.Transparent]: StandardColorNames.Transparent,
};

export const standardColorLabels: Record<
  StandardColorNames,
  StandardColorLabels
> = {
  [StandardColorNames.Black]: StandardColorLabels.Black,
  [StandardColorNames.DarkRed]: StandardColorLabels.DarkRed,
  [StandardColorNames.DarkGreen]: StandardColorLabels.DarkGreen,
  [StandardColorNames.DarkYellow]: StandardColorLabels.DarkYellow,
  [StandardColorNames.DarkBlue]: StandardColorLabels.DarkBlue,
  [StandardColorNames.DarkMagenta]: StandardColorLabels.DarkMagenta,
  [StandardColorNames.DarkCyan]: StandardColorLabels.DarkCyan,
  [StandardColorNames.LightGray]: StandardColorLabels.LightGray,
  [StandardColorNames.DarkGray]: StandardColorLabels.DarkGray,
  [StandardColorNames.Red]: StandardColorLabels.Red,
  [StandardColorNames.Green]: StandardColorLabels.Green,
  [StandardColorNames.Yellow]: StandardColorLabels.Yellow,
  [StandardColorNames.Blue]: StandardColorLabels.Blue,
  [StandardColorNames.Magenta]: StandardColorLabels.Magenta,
  [StandardColorNames.Cyan]: StandardColorLabels.Cyan,
  [StandardColorNames.White]: StandardColorLabels.White,
  [StandardColorNames.Transparent]: StandardColorLabels.Transparent,
};

export const standardColorSelectOptions: Array<{
  value: StandardColorNames;
  label: StandardColorLabels;
}> = (
  Object.entries(standardColorLabels) as Array<
    [StandardColorNames, StandardColorLabels]
  >
).map((c) => ({
  value: c[0],
  label: c[1],
}));
