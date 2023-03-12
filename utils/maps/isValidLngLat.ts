export const isValidLngLat = (arr: any): boolean => {
  return (
    Array.isArray(arr) &&
    arr.length === 2 &&
    arr.every((a) => typeof a === 'number') &&
    arr[0] >= -180 &&
    arr[0] <= 180 &&
    arr[1] >= -90 &&
    arr[1] <= 90
  );
};
