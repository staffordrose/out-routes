import { Route } from '../routes';
import { User } from '../users';

export type UserSearchRecord = { table: 'users'; record: User };
export type RouteSearchRecord = { table: 'routes'; record: Route };

export type SearchRecord = UserSearchRecord | RouteSearchRecord;
