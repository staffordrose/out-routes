import { Thread } from './Thread';

export type PaginatedThreads = {
  meta: {
    page: {
      cursor?: string;
      more: boolean;
    };
  };
  records: Thread[];
};
