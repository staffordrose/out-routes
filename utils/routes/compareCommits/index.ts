import flatten from 'lodash.flatten';

import { CompareCommitItem } from '@/types/commits';
import { PartialRouteLayersFeatures } from '@/types/routes';
import { compareRoutes } from './compareRoutes';
import { compareRouteFeatures } from './compareRouteFeatures';
import { compareRouteLayers } from './compareRouteLayers';

export const compareCommits = (
  prev: PartialRouteLayersFeatures,
  next: PartialRouteLayersFeatures
): CompareCommitItem[] => {
  // compare route
  const routeCommitItems: CompareCommitItem[] = compareRoutes(
    prev.route,
    next.route
  );

  // compare layers
  const layersCommitItems: CompareCommitItem[][] = [];

  const completedLayerIds: string[] = [];

  // iterate through prev layers
  for (let prevIndex = 0; prevIndex < (prev.layers?.length || 0); prevIndex++) {
    const prevId = prev.layers?.[prevIndex]?.id;

    if (!prevId || completedLayerIds.includes(prevId)) continue;

    completedLayerIds.push(prevId);

    const nextIndex = next.layers?.findIndex(({ id }) => id === prevId) ?? -1;

    const commitItems = compareRouteLayers(
      prev.layers?.[prevIndex],
      next.layers?.[nextIndex]
    );

    layersCommitItems.push(commitItems);
  }

  // iterate through next layers
  for (let nextIndex = 0; nextIndex < (next.layers?.length || 0); nextIndex++) {
    const nextId = next.layers?.[nextIndex]?.id;

    if (!nextId || completedLayerIds.includes(nextId)) continue;

    completedLayerIds.push(nextId);

    const prevIndex = prev.layers?.findIndex(({ id }) => id === nextId) ?? -1;

    const commitItems = compareRouteLayers(
      prev.layers?.[prevIndex],
      next.layers?.[nextIndex]
    );

    layersCommitItems.push(commitItems);
  }

  // compare features
  const featuresCommitItems: CompareCommitItem[][] = [];

  const completedFeatureIds: string[] = [];

  // iterate through prev features
  for (
    let prevIndex = 0;
    prevIndex < (prev.features?.length || 0);
    prevIndex++
  ) {
    const prevId = prev.features?.[prevIndex]?.id;

    if (!prevId || completedFeatureIds.includes(prevId)) continue;

    completedFeatureIds.push(prevId);

    const nextIndex = next.features?.findIndex(({ id }) => id === prevId) ?? -1;

    const commitItems = compareRouteFeatures(
      prev.features?.[prevIndex],
      next.features?.[nextIndex]
    );

    featuresCommitItems.push(commitItems);
  }

  // iterate through next features
  for (
    let nextIndex = 0;
    nextIndex < (next.features?.length || 0);
    nextIndex++
  ) {
    const nextId = next.features?.[nextIndex]?.id;

    if (!nextId || completedFeatureIds.includes(nextId)) continue;

    completedFeatureIds.push(nextId);

    const prevIndex = prev.features?.findIndex(({ id }) => id === nextId) ?? -1;

    const commitItems = compareRouteFeatures(
      prev.features?.[prevIndex],
      next.features?.[nextIndex]
    );

    featuresCommitItems.push(commitItems);
  }

  return flatten([
    routeCommitItems,
    ...layersCommitItems,
    ...featuresCommitItems,
  ]);
};
