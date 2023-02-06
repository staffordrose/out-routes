// https://stackoverflow.com/questions/2901102/how-to-format-a-number-with-commas-as-thousands-separators

export const numberWithCommas = (x: number): string => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
