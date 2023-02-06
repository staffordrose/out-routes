export enum RouteLayerActions {
  ADD_ROUTE_LAYER = 'add_route_layer',
  REMOVE_ROUTE_LAYER = 'remove_route_layer',
  UPDATE_LAYER_ORDER = 'update_layer_order',
  ADD_LAYER_TITLE = 'add_layer_title',
  UPDATE_LAYER_TITLE = 'update_layer_title',
  REMOVE_LAYER_TITLE = 'remove_layer_title',
  ADD_LAYER_COLOR = 'add_layer_color',
  UPDATE_LAYER_COLOR = 'update_layer_color',
  REMOVE_LAYER_COLOR = 'remove_layer_color',
  ADD_LAYER_SYMBOL = 'add_layer_symbol',
  UPDATE_LAYER_SYMBOL = 'update_layer_symbol',
  REMOVE_LAYER_SYMBOL = 'remove_layer_symbol',
}

export const routeLayerActions: Record<RouteLayerActions, RouteLayerActions> = {
  [RouteLayerActions.ADD_ROUTE_LAYER]: RouteLayerActions.ADD_ROUTE_LAYER,
  [RouteLayerActions.REMOVE_ROUTE_LAYER]: RouteLayerActions.REMOVE_ROUTE_LAYER,
  [RouteLayerActions.UPDATE_LAYER_ORDER]: RouteLayerActions.UPDATE_LAYER_ORDER,
  [RouteLayerActions.ADD_LAYER_TITLE]: RouteLayerActions.ADD_LAYER_TITLE,
  [RouteLayerActions.UPDATE_LAYER_TITLE]: RouteLayerActions.UPDATE_LAYER_TITLE,
  [RouteLayerActions.REMOVE_LAYER_TITLE]: RouteLayerActions.REMOVE_LAYER_TITLE,
  [RouteLayerActions.ADD_LAYER_COLOR]: RouteLayerActions.ADD_LAYER_COLOR,
  [RouteLayerActions.UPDATE_LAYER_COLOR]: RouteLayerActions.UPDATE_LAYER_COLOR,
  [RouteLayerActions.REMOVE_LAYER_COLOR]: RouteLayerActions.REMOVE_LAYER_COLOR,
  [RouteLayerActions.ADD_LAYER_SYMBOL]: RouteLayerActions.ADD_LAYER_SYMBOL,
  [RouteLayerActions.UPDATE_LAYER_SYMBOL]:
    RouteLayerActions.UPDATE_LAYER_SYMBOL,
  [RouteLayerActions.REMOVE_LAYER_SYMBOL]:
    RouteLayerActions.REMOVE_LAYER_SYMBOL,
};

export const routeLayerActionsSort = Object.values(RouteLayerActions);
