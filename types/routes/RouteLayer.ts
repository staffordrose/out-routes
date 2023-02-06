import { RouteLayers } from '@/xata';

export type RouteLayer = RouteLayers;

export type PartialRouteLayer = Pick<RouteLayer, 'id'> & Partial<RouteLayer>;
