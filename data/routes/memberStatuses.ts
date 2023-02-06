export enum MemberStatuses {
  ACTIVE = 'active',
  PENDING = 'pending',
}

export enum MemberStatusLabels {
  ACTIVE = 'Active',
  PENDING = 'Pending',
}

export const memberStatuses: Record<MemberStatuses, MemberStatuses> = {
  [MemberStatuses.ACTIVE]: MemberStatuses.ACTIVE,
  [MemberStatuses.PENDING]: MemberStatuses.PENDING,
};

export const memberStatusLables: Record<MemberStatuses, MemberStatusLabels> = {
  [MemberStatuses.ACTIVE]: MemberStatusLabels.ACTIVE,
  [MemberStatuses.PENDING]: MemberStatusLabels.PENDING,
};
