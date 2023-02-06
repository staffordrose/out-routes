import { Commit } from './Commit';
import { CommitItem } from './CommitItem';

export type CommitWithItems = {
  commit: Commit;
  items: CommitItem[];
};
