import { Commit } from './Commit';

export type PaginatedCommits = {
  meta: {
    page: {
      cursor?: string;
      more: boolean;
    };
  };
  records: Commit[];
};
