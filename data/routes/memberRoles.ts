export enum MemberRoles {
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  CONTRIBUTOR = 'contributor',
  VIEWER = 'viewer',
}

export enum MemberRoleLabels {
  ADMIN = 'Admin',
  MODERATOR = 'Moderator',
  CONTRIBUTOR = 'Contributor',
  VIEWER = 'Viewer',
}

export const memberRoles: Record<MemberRoles, MemberRoles> = {
  [MemberRoles.ADMIN]: MemberRoles.ADMIN,
  [MemberRoles.MODERATOR]: MemberRoles.MODERATOR,
  [MemberRoles.CONTRIBUTOR]: MemberRoles.CONTRIBUTOR,
  [MemberRoles.VIEWER]: MemberRoles.VIEWER,
};

export const memberRoleLabels: Record<MemberRoles, MemberRoleLabels> = {
  [MemberRoles.ADMIN]: MemberRoleLabels.ADMIN,
  [MemberRoles.MODERATOR]: MemberRoleLabels.MODERATOR,
  [MemberRoles.CONTRIBUTOR]: MemberRoleLabels.CONTRIBUTOR,
  [MemberRoles.VIEWER]: MemberRoleLabels.VIEWER,
};
