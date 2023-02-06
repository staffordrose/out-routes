import { Route } from './Route';

export type PaginatedRoutes = {
  meta: {
    page: {
      cursor?: string;
      more: boolean;
    };
  };
  records: Route[];
};
