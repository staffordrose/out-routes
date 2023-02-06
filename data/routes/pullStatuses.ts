export enum PullStatuses {
  OPEN = 'open',
  MERGED = 'merged',
  CLOSED = 'closed',
}

export enum PullStatusLabels {
  OPEN = 'Open',
  MERGED = 'Merged',
  CLOSED = 'Closed',
}

export const pullStatuses: Record<PullStatuses, PullStatuses> = {
  [PullStatuses.OPEN]: PullStatuses.OPEN,
  [PullStatuses.MERGED]: PullStatuses.MERGED,
  [PullStatuses.CLOSED]: PullStatuses.CLOSED,
};

export const pullStatusLables: Record<PullStatuses, PullStatusLabels> = {
  [PullStatuses.OPEN]: PullStatusLabels.OPEN,
  [PullStatuses.MERGED]: PullStatusLabels.MERGED,
  [PullStatuses.CLOSED]: PullStatusLabels.OPEN,
};
