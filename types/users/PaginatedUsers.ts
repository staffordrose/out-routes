import { User } from './User';

export type PaginatedUsers = {
  meta: {
    page: {
      cursor?: string;
      more: boolean;
    };
  };
  records: User[];
};
