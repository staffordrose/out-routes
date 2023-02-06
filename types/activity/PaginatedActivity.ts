import { Activity } from './Activity';

export type PaginatedActivity = {
  meta: {
    page: {
      cursor?: string;
      more: boolean;
    };
  };
  records: Activity[];
};
