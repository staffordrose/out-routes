import { Pull } from './Pull';

export type PaginatedPulls = {
  meta: {
    page: {
      cursor?: string;
      more: boolean;
    };
  };
  records: Pull[];
};
