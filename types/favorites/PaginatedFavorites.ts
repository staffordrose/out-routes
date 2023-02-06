import { Favorite } from './Favorite';

export type PaginatedFavorites = {
  meta: {
    page: {
      cursor?: string;
      more: boolean;
    };
  };
  records: Favorite[];
};
