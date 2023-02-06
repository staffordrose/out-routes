import { Following } from './Following';

export type PaginatedFollowing = {
  meta: {
    page: {
      cursor?: string;
      more: boolean;
    };
  };
  records: Following[];
};
