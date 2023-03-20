import { Position } from 'geojson';

import { MapFeature } from '@/types/maps';
import { getMapFeatureDistances, round } from '@/utils';

export const getSVGPaths = (
  features: MapFeature[],
  kmTotal: number,
  eleMax: number,
  eleMin: number
) => {
  const featureSeparators: { d: string }[] = [];
  const featurePaths: { d: string; color?: string }[] = [];

  let featureStartDist = 0;

  features.forEach((feature, featureIndex) => {
    const {
      geometry: { coordinates },
      properties: { layerColor, color },
    } = feature;

    const { distances } = getMapFeatureDistances(feature);

    const relativeDistances = distances.map((d) => d / kmTotal);

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
        return 0;
      }

      return (position[2] - eleMin) / (eleMax - eleMin);
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
        const x = round(100 * featureStartDist, 3);
        const y = round(100 * (1 - ele), 3);
        segment = `M${x},${y} `;
      } else {
        const x = round(100 * dist, 3);
        const y = round(100 * eleDiff, 3);
        segment = `l${x},${y} `;
      }

      d = d.concat(segment);
    }

    if (featureIndex > 0) {
      const x = round(100 * featureStartDist, 3);
      featureSeparators.push({ d: `M${x},0 V100` });
    }

    featureStartDist += featureDistance;

    featurePaths.push({ d, color: color || layerColor });
  });

  return { featureSeparators, featurePaths };
};
