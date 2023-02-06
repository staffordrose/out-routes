import { ThreadComment } from './ThreadComment';

export type PaginatedThreadComments = {
  meta: {
    page: {
      cursor?: string;
      more: boolean;
    };
  };
  records: ThreadComment[];
};
