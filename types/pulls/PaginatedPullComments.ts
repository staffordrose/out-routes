import { PullComment } from './PullComment';

export type PaginatedPullComments = {
  meta: {
    page: {
      cursor?: string;
      more: boolean;
    };
  };
  records: PullComment[];
};
