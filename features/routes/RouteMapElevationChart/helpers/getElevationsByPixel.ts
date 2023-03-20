import { Position } from 'geojson';
import flatten from 'lodash.flatten';

import { MapFeature } from '@/types/maps';
import { getMapFeatureDistances, round } from '@/utils';

type Feature = {
  coordinates: Position[];
  totalDistance: number;
  distances: number[];
};

type FeatureElevations = (number[] | number | undefined)[];

type Elevations = FeatureElevations[];

export const getElevationsByPixel = (
  containerWidth: number,
  mapFeatures: MapFeature[]
): number[] => {
  if (!containerWidth) {
    return [];
  }

  const { kmTotal, features } = mapFeatures.reduce(
    (accum, feature) => {
      const { totalDistance, distances } = getMapFeatureDistances(feature);

      accum.kmTotal += totalDistance;
      accum.features.push({
        coordinates: feature.geometry.coordinates as Position[],
        totalDistance,
        distances,
      });

      return accum;
    },
    { kmTotal: 0, features: [] } as {
      kmTotal: number;
      features: Feature[];
    }
  );

  const featureWidths = getFeatureWidths(containerWidth, kmTotal, features);

  let elevations: Elevations = [];

  elevations = getExplicitElevations(features, featureWidths);

  elevations = addImplicitElevations(elevations);

  return flatten(elevations as number[][]);
};

/**
 * create array of pixel widths of each feature
 */
const getFeatureWidths = (
  containerWidth: number,
  kmTotal: number,
  features: Feature[]
): number[] => {
  let featureWidths = features.reduce(
    (accum, feature) => (
      accum.push((feature.totalDistance / kmTotal) * containerWidth), accum
    ),
    [] as number[]
  );

  /**
   * difference in length between the containerWidth
   * and the sum of all feature widths, rounded to the nearest integer
   */
  const widthDifference =
    containerWidth -
    featureWidths.reduce((sum, width) => ((sum += Math.round(width)), sum), 0);

  /**
   * ensure the combined pixel width of all features is
   * equal to the pixel width of the containing div
   */
  if (widthDifference === 0) {
    // round featureWidths to nearest integer
    return featureWidths.map((width) => Math.round(width));
  } else {
    const widthDifferenceArr = Array.from({
      length: Math.abs(widthDifference),
    });

    const featureWidthRemainders = featureWidths.map((width) =>
      round(width % 1, 3)
    );

    let remainderIndices: number[] = [];

    if (widthDifference > 0) {
      // find feature(s) width highest remainder below 0.5
      widthDifferenceArr.forEach(() => {
        // get highest remainder left that is below 0.5
        const highestRemainder = featureWidthRemainders
          .filter(
            (remainder, index) =>
              !remainderIndices.includes(index) && remainder < 0.5
          )
          .sort((a, b) => b - a)[0];

        // add to remainderIndices
        remainderIndices.push(
          featureWidthRemainders.findIndex((r) => r === highestRemainder)
        );
      });

      // round featureWidths using remainderIndices
      return featureWidths.map((width, index) =>
        remainderIndices.includes(index) ? Math.ceil(width) : Math.round(width)
      );
    } else {
      // find feature(s) width lowest remainder equal to or above 0.5
      widthDifferenceArr.forEach(() => {
        // get lowest remainder left that is equal to or above 0.5
        const lowestRemainder = featureWidthRemainders
          .filter(
            (remainder, index) =>
              !remainderIndices.includes(index) && remainder >= 0.5
          )
          .sort((a, b) => a - b)[0];

        // add to remainderIndices
        remainderIndices.push(
          featureWidthRemainders.findIndex((r) => r === lowestRemainder)
        );
      });

      // round featureWidths using remainderIndices
      return featureWidths.map((width, index) =>
        remainderIndices.includes(index) ? Math.floor(width) : Math.round(width)
      );
    }
  }
};

/**
 * for each feature, create an array of empty values the length of the
 * feature's width in pixels
 *
 * for each routepoint, set the point's elevation in featureElevations
 * using the point's distance from the start of the feature
 */
const getExplicitElevations = (
  features: Feature[],
  featureWidths: number[]
): Elevations => {
  const elevations: Elevations = [];

  for (let i = 0; i < features.length; i++) {
    const feature = features[i];
    const featureWidth = featureWidths[i];

    const featureElevations: FeatureElevations = Array.from({
      length: featureWidth,
    });

    let sumDistance = 0;

    for (let j = 0; j < feature.coordinates.length; j++) {
      const distance = j === 0 ? 0 : feature.distances[j - 1];

      const progress = (sumDistance + distance) / feature.totalDistance;

      const featureElevationsIndex = Math.round(progress * featureWidth);

      featureElevations[featureElevationsIndex] = feature.coordinates[j][2];

      sumDistance += distance;
    }

    elevations.push(featureElevations);
  }

  return elevations;
};

/**
 * fill in empty indices by calculating estimates using
 * elevation figures in surrounding indices
 */
const addImplicitElevations = (explicitElevations: Elevations): Elevations => {
  const elevations = Array.from(explicitElevations);

  for (let i = 0; i < elevations.length; i++) {
    for (let j = 0; j < elevations[i].length; j++) {
      if (typeof elevations[i][j] === 'number') {
        continue;
      }

      const prevElevations = elevations[i].slice(0, j);

      const prevEleIndex =
        j -
        1 -
        prevElevations.reverse().findIndex((e) => typeof e === 'number');
      const prevEle = Number(elevations[i][prevEleIndex]);

      const nextElevations = elevations[i].slice(j);
      const nextEleIndex =
        j + nextElevations.findIndex((e) => typeof e === 'number');

      const nextEle = Number(elevations[i][nextEleIndex]);

      const implicitEle =
        prevEle +
        (nextEle - prevEle) *
          ((j - prevEleIndex) / (nextEleIndex - prevEleIndex));

      /**
       * nest implicit elevation in array, so it won't be
       * used in calculating other implicit elevations
       */
      elevations[i][j] = [implicitEle];
    }

    // flatten implicit elevations for current feature
    elevations[i] = flatten(elevations[i]);

    // ensure each feature elevation is a number
    if (
      elevations[i].some((ele) => typeof ele !== 'number' || Number.isNaN(ele))
    ) {
      elevations[i] = elevations[i].map((ele) => {
        if (typeof ele !== 'number' || Number.isNaN(ele)) {
          return 0;
        } else {
          return ele;
        }
      });
    }
  }

  return elevations;
};
