import { Member } from './Member';

export type PaginatedMembers = {
  meta: {
    page: {
      cursor?: string;
      more: boolean;
    };
  };
  records: Member[];
};
