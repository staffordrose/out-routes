import { Contributor } from './Contributor';

export type PaginatedContributors = {
  meta: {
    page: {
      cursor?: string;
      more: boolean;
    };
  };
  records: Contributor[];
};
