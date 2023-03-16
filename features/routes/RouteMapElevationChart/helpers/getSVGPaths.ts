import { Position } from 'geojson';

import { MapFeature } from '@/types/maps';
import { getLineStringSegmentDistances, roundToDecimalCount } from '@/utils';

export const getSVGPaths = (
  features: MapFeature[],
  totalKm: number,
  eleMax: number,
  eleMin: number
) => {
  const featureSeparators: { d: string }[] = [];
  const featurePaths: { d: string; color?: string }[] = [];

  let featureStartDist = 0;

  features.forEach(
    (
      { geometry: { coordinates }, properties: { layerColor, color } },
      featureIndex
    ) => {
      const distances = getLineStringSegmentDistances(
        coordinates as Position[]
      );

      const relativeDistances = distances.map((d, i) => {
        const r = d / totalKm;

        if (i === 0 || i === distances.length - 1) {
          // shorten first and last distance
          return r - 0.001;
        } else {
          return r;
        }
      });

      const featureDistance = relativeDistances.reduce(
        (sum, curr) => ((sum += curr), sum),
        0
      );

      const relativeElevations = (coordinates as Position[]).map((position) => {
        if (
          typeof eleMin !== 'number' ||
          Number.isNaN(eleMin) ||
          eleMin === eleMax
        ) {
          // prevent relative elevation from reaching 0
          return 0.0125;
        }

        let ele = (position[2] - eleMin) / (eleMax - eleMin);

        // prevent relative elevation from reaching 0 or 100
        ele = Math.min(0.9875, ele);
        ele = Math.max(0.0125, ele);

        return ele;
      });

      let d = '';
      let prevEle = null;

      for (const index in coordinates as Position[]) {
        let dist = 0;

        if (Number(index) > 0) {
          dist += relativeDistances[Number(index) - 1];
        }

        const ele = relativeElevations[index];

        const eleDiff = (prevEle || 0) - ele;

        prevEle = ele;

        let segment = '';

        if (Number(index) === 0) {
          const x = roundToDecimalCount(100 * (featureStartDist + 0.002), {
            decimalCount: 3,
          });
          const y = roundToDecimalCount(100 * (1 - ele), {
            decimalCount: 3,
          });
          segment = `M${x},${y} `;
        } else if (Number(index) === coordinates.length - 1) {
          const x = roundToDecimalCount(100 * (dist - 0.002), {
            decimalCount: 3,
          });
          const y = roundToDecimalCount(100 * eleDiff, {
            decimalCount: 3,
          });
          segment = `l${x},${y} `;
        } else {
          const x = roundToDecimalCount(100 * dist, {
            decimalCount: 3,
          });
          const y = roundToDecimalCount(100 * eleDiff, {
            decimalCount: 3,
          });
          segment = `l${x},${y} `;
        }

        d = d.concat(segment);
      }

      if (featureIndex > 0) {
        const x = roundToDecimalCount(100 * featureStartDist, {
          decimalCount: 3,
        });
        featureSeparators.push({ d: `M${x},0 V100` });
      }

      featureStartDist += featureDistance + 0.002;

      featurePaths.push({ d, color: color || layerColor });
    }
  );

  return { featureSeparators, featurePaths };
};
