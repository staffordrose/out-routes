import { FC, Fragment, useMemo } from 'react';
import { BiMapAlt } from 'react-icons/bi';

import { Box, Flex, Separator } from '@/components/atoms';
import { Feedback } from '@/components/layout';
import {
  RouteActions,
  routeActionsSort,
  RouteFeatureActions,
  routeFeatureActionsSort,
  RouteLayerActions,
  routeLayerActionsSort,
} from '@/data/routes';
import {
  CompareCommitItem,
  RouteCommitItem as RouteCommitItemT,
  RouteFeatureCommitItem as RouteFeatureCommitItemT,
  RouteLayerCommitItem as RouteLayerCommitItemT,
} from '@/types';
import { RouteCommitItem } from './RouteCommitItem';
import { RouteFeatureCommitItem } from './RouteFeatureCommitItem';
import { RouteLayerCommitItem } from './RouteLayerCommitItem';

export type CommitItemsListProps = {
  items: CompareCommitItem[];
};

export const CommitItemsList: FC<CommitItemsListProps> = ({ items }) => {
  const { routeCommitItems, layerCommitItems, featureCommitItems } =
    useMemo(() => {
      const routeCommitItems: RouteCommitItemT[] = (items as RouteCommitItemT[])
        .filter(({ action }) =>
          routeActionsSort.includes(action as RouteActions)
        )
        .sort(
          (a, b) =>
            routeActionsSort.indexOf(a.action as RouteActions) -
            routeActionsSort.indexOf(b.action as RouteActions)
        );

      /**
       * TODO: Layers should be sorted by order
       * Otherwise, sort by layer id, then sort by routeLayerActionsSort
       */
      const layerCommitItems: RouteLayerCommitItemT[] = (
        items as RouteLayerCommitItemT[]
      )
        .filter(({ action }) =>
          routeLayerActionsSort.includes(action as RouteLayerActions)
        )
        .sort(
          (a, b) =>
            routeLayerActionsSort.indexOf(a.action as RouteLayerActions) -
            routeLayerActionsSort.indexOf(b.action as RouteLayerActions)
        );

      /**
       * TODO: Features should be sorted by order
       * Otherwise, sort by feature id, then sort by routeFeatureActionsSort
       */
      const featureCommitItems: RouteFeatureCommitItemT[] = (
        items as RouteFeatureCommitItemT[]
      )
        .filter(({ action }) =>
          routeFeatureActionsSort.includes(action as RouteFeatureActions)
        )
        .sort(
          (a, b) =>
            routeFeatureActionsSort.indexOf(a.action as RouteFeatureActions) -
            routeFeatureActionsSort.indexOf(b.action as RouteFeatureActions)
        );

      return {
        routeCommitItems,
        layerCommitItems,
        featureCommitItems,
      };
    }, [items]);

  return (
    <Box width='full'>
      <Flex direction='column' gap='sm' marginBottom='xl'>
        <h3>Route Details</h3>
        {Array.isArray(routeCommitItems) && routeCommitItems.length > 0 ? (
          routeCommitItems.map((commitItem, i) => {
            return (
              <Fragment key={commitItem.id}>
                <RouteCommitItem {...commitItem} />
                {i < routeCommitItems.length - 1 && (
                  <Separator
                    width='full'
                    height='xs'
                    marginY='md'
                    colorScale={100}
                  />
                )}
              </Fragment>
            );
          })
        ) : (
          <Feedback size='xs' type='empty' icon={BiMapAlt} title='No Changes'>
            No route details were changed.
          </Feedback>
        )}
      </Flex>
      {Array.isArray(layerCommitItems) && layerCommitItems.length > 0 && (
        <>
          <Separator width='full' height='xs' marginY='lg' colorScale={300} />
          <Box marginBottom='xl'>
            <h3>Layers</h3>
            {layerCommitItems.map((commitItem, i) => {
              return (
                <Fragment key={commitItem.id}>
                  <RouteLayerCommitItem {...commitItem} />
                  {i < layerCommitItems.length - 1 && (
                    <Separator
                      width='full'
                      height='xs'
                      marginY='md'
                      colorScale={100}
                    />
                  )}
                </Fragment>
              );
            })}
          </Box>
        </>
      )}
      {Array.isArray(featureCommitItems) && featureCommitItems.length > 0 && (
        <>
          <Separator width='full' height='xs' marginY='lg' colorScale={300} />
          <Box marginBottom='xl'>
            <h3>Features</h3>
            {featureCommitItems.map((commitItem, i) => {
              return (
                <Fragment key={commitItem.id}>
                  <RouteFeatureCommitItem {...commitItem} />
                  {i < featureCommitItems.length - 1 && (
                    <Separator
                      width='full'
                      height='xs'
                      marginY='md'
                      colorScale={100}
                    />
                  )}
                </Fragment>
              );
            })}
          </Box>
        </>
      )}
    </Box>
  );
};
