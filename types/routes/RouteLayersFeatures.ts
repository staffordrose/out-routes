import { PartialRoute, Route } from './Route';
import { PartialRouteFeature, RouteFeature } from './RouteFeature';
import { PartialRouteLayer, RouteLayer } from './RouteLayer';

export type RouteLayersFeatures = {
  route: Route;
  layers: RouteLayer[];
  features: RouteFeature[];
};

export type PartialRouteLayersFeatures = {
  route?: PartialRoute;
  layers?: PartialRouteLayer[];
  features?: PartialRouteFeature[];
};
