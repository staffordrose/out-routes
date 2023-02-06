import { Follower } from './Follower';

export type PaginatedFollowers = {
  meta: {
    page: {
      cursor?: string;
      more: boolean;
    };
  };
  records: Follower[];
};
