import { kilometersToMiles, round } from '@/utils';

export const getDistances = (
  containerWidth: number,
  kmTotal: number
): number[] => {
  let distances = [];

  if (kmTotal < 1) {
    distances = getDistancesByMultiple(containerWidth, kmTotal, 0.1);
  } else if (kmTotal < 3) {
    distances = getDistancesByMultiple(containerWidth, kmTotal, 0.5);
  } else if (kmTotal < 7.5) {
    distances = getDistancesByMultiple(containerWidth, kmTotal, 1);
  } else if (kmTotal < 15) {
    distances = getDistancesByMultiple(containerWidth, kmTotal, 2.5);
  } else {
    distances = getDistancesByMultiple(containerWidth, kmTotal, 5);
  }

  return distances;
};

const getDistancesByMultiple = (
  containerWidth: number,
  kmTotal: number,
  multiple: number
) => {
  const totalMi = kilometersToMiles(kmTotal);

  // number of labels to show - zero is added later
  const countLessZero = 3;

  const incrementFloat = totalMi / countLessZero;

  // round incrementFloat to nearest multiple
  let increment: number;
  if (multiple < 0.5) {
    increment = Math.round(incrementFloat * 10) / 10;
  } else {
    increment = Math.round(incrementFloat / multiple) * multiple;
  }

  // float value of how many distances to show
  const distancesCount = totalMi / increment;
  const distancesCountInt = Math.floor(distancesCount);
  const distancesCountRemainder = distancesCount % 1;

  // width in pixels of last distance label - set manually for now
  const lastLabelWidth = 45;

  const lastWholeDistance = distancesCountInt * increment;

  // show/hide last whole distance depending on space available in the containing div
  const showLastWholeDistance =
    lastWholeDistance / totalMi <= 1 - lastLabelWidth / containerWidth;

  /**
   * show final partial distance if it is greater than last whole distance
   * by a given threshold
   */
  const threshold = 0.2;
  const lastDistanceIsPartial = distancesCountRemainder >= threshold;

  const showAllDistances = lastDistanceIsPartial && showLastWholeDistance;

  /**
   * determine length of distances array, based on showAllDistances
   * then, add back zero value to distances length
   */
  const length =
    (showAllDistances ? distancesCountInt + 1 : distancesCountInt) + 1;

  return Array.from(
    {
      length,
    },
    (_, i) => {
      if (i === length - 1) {
        if (showAllDistances) {
          return round(
            (i - 1) * increment + distancesCountRemainder * increment,
            2
          );
        } else {
          return round(i * increment + distancesCountRemainder * increment, 2);
        }
      }
      return round(i * increment, 1);
    }
  );
};
