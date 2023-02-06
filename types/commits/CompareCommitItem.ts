import {
  RouteActions,
  RouteFeatureActions,
  RouteLayerActions,
} from '@/data/routes';
import {
  PartialRoute,
  PartialRouteFeature,
  PartialRouteLayer,
} from '../routes';

export type RouteCommitItem = {
  id: string;
  action: RouteActions;
  payload: {
    prev?: PartialRoute;
    next?: PartialRoute;
  };
  resource_id: string;
  resource_table: 'routes';
};

export type RouteLayerCommitItem = {
  id: string;
  action: RouteLayerActions;
  payload: {
    prev?: PartialRouteLayer;
    next?: PartialRouteLayer;
  };
  resource_id: string;
  resource_table: 'route_layers';
};

export type RouteFeatureCommitItem = {
  id: string;
  action: RouteFeatureActions;
  payload: {
    prev?: PartialRouteFeature;
    next?: PartialRouteFeature;
  };
  resource_id: string;
  resource_table: 'route_features';
};

export type CompareCommitItem = {
  id: string;
  action: RouteActions | RouteLayerActions | RouteFeatureActions;
  payload: {
    prev?: PartialRoute | PartialRouteLayer | PartialRouteFeature;
    next?: PartialRoute | PartialRouteLayer | PartialRouteFeature;
  };
  resource_id: string;
  resource_table: 'routes' | 'route_layers' | 'route_features';
};
