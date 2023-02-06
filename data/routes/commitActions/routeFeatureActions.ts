export enum RouteFeatureActions {
  ADD_ROUTE_FEATURE = 'add_route_feature',
  REMOVE_ROUTE_FEATURE = 'remove_route_feature',
  UPDATE_FEATURE_LAYER = 'update_feature_layer',
  UPDATE_FEATURE_ORDER = 'update_feature_order',
  UPDATE_FEATURE_TYPE = 'update_feature_type',
  ADD_FEATURE_COORDINATES = 'add_feature_coordinates',
  UPDATE_FEATURE_COORDINATES = 'update_feature_coordinates',
  REMOVE_FEATURE_COORDINATES = 'remove_feature_coordinates',
  ADD_FEATURE_TITLE = 'add_feature_title',
  UPDATE_FEATURE_TITLE = 'update_feature_title',
  REMOVE_FEATURE_TITLE = 'remove_feature_title',
  ADD_FEATURE_COLOR = 'add_feature_color',
  UPDATE_FEATURE_COLOR = 'update_feature_color',
  REMOVE_FEATURE_COLOR = 'remove_feature_color',
  ADD_FEATURE_SYMBOL = 'add_feature_symbol',
  UPDATE_FEATURE_SYMBOL = 'update_feature_symbol',
  REMOVE_FEATURE_SYMBOL = 'remove_feature_symbol',
  ADD_FEATURE_DESCRIPTION = 'add_feature_description',
  UPDATE_FEATURE_DESCRIPTION = 'update_feature_description',
  REMOVE_FEATURE_DESCRIPTION = 'remove_feature_description',
  ADD_FEATURE_ELE_START = 'add_feature_ele_start',
  UPDATE_FEATURE_ELE_START = 'update_feature_ele_start',
  REMOVE_FEATURE_ELE_START = 'remove_feature_ele_start',
  ADD_FEATURE_ELE_END = 'add_feature_ele_end',
  UPDATE_FEATURE_ELE_END = 'update_feature_ele_end',
  REMOVE_FEATURE_ELE_END = 'remove_feature_ele_end',
  ADD_FEATURE_DISTANCE = 'add_feature_distance',
  UPDATE_FEATURE_DISTANCE = 'update_feature_distance',
  REMOVE_FEATURE_DISTANCE = 'remove_feature_distance',
  ADD_FEATURE_AREA = 'add_feature_area',
  UPDATE_FEATURE_AREA = 'update_feature_area',
  REMOVE_FEATURE_AREA = 'remove_feature_area',
  ADD_FEATURE_IMAGE = 'add_feature_image',
  UPDATE_FEATURE_IMAGE = 'update_feature_image',
  REMOVE_FEATURE_IMAGE = 'remove_feature_image',
}

export const routeFeatureActions: Record<
  RouteFeatureActions,
  RouteFeatureActions
> = {
  [RouteFeatureActions.ADD_ROUTE_FEATURE]:
    RouteFeatureActions.ADD_ROUTE_FEATURE,
  [RouteFeatureActions.REMOVE_ROUTE_FEATURE]:
    RouteFeatureActions.REMOVE_ROUTE_FEATURE,
  [RouteFeatureActions.UPDATE_FEATURE_LAYER]:
    RouteFeatureActions.UPDATE_FEATURE_LAYER,
  [RouteFeatureActions.UPDATE_FEATURE_ORDER]:
    RouteFeatureActions.UPDATE_FEATURE_ORDER,
  [RouteFeatureActions.UPDATE_FEATURE_TYPE]:
    RouteFeatureActions.UPDATE_FEATURE_TYPE,
  [RouteFeatureActions.ADD_FEATURE_COORDINATES]:
    RouteFeatureActions.ADD_FEATURE_COORDINATES,
  [RouteFeatureActions.UPDATE_FEATURE_COORDINATES]:
    RouteFeatureActions.UPDATE_FEATURE_COORDINATES,
  [RouteFeatureActions.REMOVE_FEATURE_COORDINATES]:
    RouteFeatureActions.REMOVE_FEATURE_COORDINATES,
  [RouteFeatureActions.ADD_FEATURE_TITLE]:
    RouteFeatureActions.ADD_FEATURE_TITLE,
  [RouteFeatureActions.UPDATE_FEATURE_TITLE]:
    RouteFeatureActions.UPDATE_FEATURE_TITLE,
  [RouteFeatureActions.REMOVE_FEATURE_TITLE]:
    RouteFeatureActions.REMOVE_FEATURE_TITLE,
  [RouteFeatureActions.ADD_FEATURE_COLOR]:
    RouteFeatureActions.ADD_FEATURE_COLOR,
  [RouteFeatureActions.UPDATE_FEATURE_COLOR]:
    RouteFeatureActions.UPDATE_FEATURE_COLOR,
  [RouteFeatureActions.REMOVE_FEATURE_COLOR]:
    RouteFeatureActions.REMOVE_FEATURE_COLOR,
  [RouteFeatureActions.ADD_FEATURE_SYMBOL]:
    RouteFeatureActions.ADD_FEATURE_SYMBOL,
  [RouteFeatureActions.UPDATE_FEATURE_SYMBOL]:
    RouteFeatureActions.UPDATE_FEATURE_SYMBOL,
  [RouteFeatureActions.REMOVE_FEATURE_SYMBOL]:
    RouteFeatureActions.REMOVE_FEATURE_SYMBOL,
  [RouteFeatureActions.ADD_FEATURE_DESCRIPTION]:
    RouteFeatureActions.ADD_FEATURE_DESCRIPTION,
  [RouteFeatureActions.UPDATE_FEATURE_DESCRIPTION]:
    RouteFeatureActions.UPDATE_FEATURE_DESCRIPTION,
  [RouteFeatureActions.REMOVE_FEATURE_DESCRIPTION]:
    RouteFeatureActions.REMOVE_FEATURE_DESCRIPTION,
  [RouteFeatureActions.ADD_FEATURE_ELE_START]:
    RouteFeatureActions.ADD_FEATURE_ELE_START,
  [RouteFeatureActions.UPDATE_FEATURE_ELE_START]:
    RouteFeatureActions.UPDATE_FEATURE_ELE_START,
  [RouteFeatureActions.REMOVE_FEATURE_ELE_START]:
    RouteFeatureActions.REMOVE_FEATURE_ELE_START,
  [RouteFeatureActions.ADD_FEATURE_ELE_END]:
    RouteFeatureActions.ADD_FEATURE_ELE_END,
  [RouteFeatureActions.UPDATE_FEATURE_ELE_END]:
    RouteFeatureActions.UPDATE_FEATURE_ELE_END,
  [RouteFeatureActions.REMOVE_FEATURE_ELE_END]:
    RouteFeatureActions.REMOVE_FEATURE_ELE_END,
  [RouteFeatureActions.ADD_FEATURE_DISTANCE]:
    RouteFeatureActions.ADD_FEATURE_DISTANCE,
  [RouteFeatureActions.UPDATE_FEATURE_DISTANCE]:
    RouteFeatureActions.UPDATE_FEATURE_DISTANCE,
  [RouteFeatureActions.REMOVE_FEATURE_DISTANCE]:
    RouteFeatureActions.REMOVE_FEATURE_DISTANCE,
  [RouteFeatureActions.ADD_FEATURE_AREA]: RouteFeatureActions.ADD_FEATURE_AREA,
  [RouteFeatureActions.UPDATE_FEATURE_AREA]:
    RouteFeatureActions.UPDATE_FEATURE_AREA,
  [RouteFeatureActions.REMOVE_FEATURE_AREA]:
    RouteFeatureActions.REMOVE_FEATURE_AREA,
  [RouteFeatureActions.ADD_FEATURE_IMAGE]:
    RouteFeatureActions.ADD_FEATURE_IMAGE,
  [RouteFeatureActions.UPDATE_FEATURE_IMAGE]:
    RouteFeatureActions.UPDATE_FEATURE_IMAGE,
  [RouteFeatureActions.REMOVE_FEATURE_IMAGE]:
    RouteFeatureActions.REMOVE_FEATURE_IMAGE,
};

export const routeFeatureActionsSort = Object.values(RouteFeatureActions);
