import { routeActions, RouteActions } from './routeActions';
import {
  routeFeatureActions,
  RouteFeatureActions,
} from './routeFeatureActions';
import { routeLayerActions, RouteLayerActions } from './routeLayerActions';

export type CommitActions =
  | RouteActions
  | RouteLayerActions
  | RouteFeatureActions;

export const commitActions = {
  ...routeActions,
  ...routeLayerActions,
  ...routeFeatureActions,
};

export const commitActionsSort = [
  ...Object.values(RouteActions),
  ...Object.values(RouteLayerActions),
  ...Object.values(RouteFeatureActions),
];
