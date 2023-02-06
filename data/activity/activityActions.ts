import { DatabaseSchemaKey, databaseSchema } from '../db';

export enum ActivityActions {
  FOLLOW_USER = 'follow_user',
  FAVORITE_ROUTE = 'favorite_route',
  ADD_ROUTE = 'add_route',
  FORK_ROUTE = 'fork_route',
  UPDATE_ROUTE = 'update_route',
}

export const activityActions: Record<ActivityActions, ActivityActions> = {
  [ActivityActions.FOLLOW_USER]: ActivityActions.FOLLOW_USER,
  [ActivityActions.FAVORITE_ROUTE]: ActivityActions.FAVORITE_ROUTE,
  [ActivityActions.ADD_ROUTE]: ActivityActions.ADD_ROUTE,
  [ActivityActions.FORK_ROUTE]: ActivityActions.FORK_ROUTE,
  [ActivityActions.UPDATE_ROUTE]: ActivityActions.UPDATE_ROUTE,
};

export const activityActionTables: Record<ActivityActions, DatabaseSchemaKey> =
  {
    [ActivityActions.FOLLOW_USER]: databaseSchema.user_relationships,
    [ActivityActions.FAVORITE_ROUTE]: databaseSchema.route_favorites,
    [ActivityActions.ADD_ROUTE]: databaseSchema.routes,
    [ActivityActions.FORK_ROUTE]: databaseSchema.routes,
    [ActivityActions.UPDATE_ROUTE]: databaseSchema.routes,
  };
