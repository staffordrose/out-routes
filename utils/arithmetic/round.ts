export const round = (num: number, decimalCount?: number) => {
  const power = Math.pow(10, decimalCount ?? 2);

  return Math.round((num + Number.EPSILON) * power) / power;
};
