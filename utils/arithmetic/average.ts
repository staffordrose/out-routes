export const average = (nums: number[]): number => {
  return nums.reduce((sum, n) => sum + n, 0) / nums.length;
};
