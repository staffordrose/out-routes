import { Route } from './Route';
import { User } from '../users';

export type UsernameAndSlug = Pick<User, 'username'> & Pick<Route, 'slug'>;
