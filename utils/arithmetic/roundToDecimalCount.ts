export const roundToDecimalCount = (
  num: number,
  options?: { decimalCount?: number }
) => {
  const power = Math.pow(10, options?.decimalCount ?? 2);

  return Math.round((num + Number.EPSILON) * power) / power;
};
