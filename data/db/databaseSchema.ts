import { DatabaseSchema } from '@/xata';

export type DatabaseSchemaKey = keyof DatabaseSchema;

export const databaseSchema: Record<DatabaseSchemaKey, DatabaseSchemaKey> = {
  nextauth_users: 'nextauth_users',
  nextauth_users_accounts: 'nextauth_users_accounts',
  nextauth_accounts: 'nextauth_accounts',
  nextauth_users_sessions: 'nextauth_users_sessions',
  nextauth_sessions: 'nextauth_sessions',
  nextauth_verificationTokens: 'nextauth_verificationTokens',
  users: 'users',
  user_relationships: 'user_relationships',
  routes: 'routes',
  route_layers: 'route_layers',
  route_features: 'route_features',
  route_commits: 'route_commits',
  route_commit_items: 'route_commit_items',
  route_pulls: 'route_pulls',
  route_pull_items: 'route_pull_items',
  route_pull_comments: 'route_pull_comments',
  route_threads: 'route_threads',
  route_thread_comments: 'route_thread_comments',
  route_members: 'route_members',
  route_contributors: 'route_contributors',
  route_favorites: 'route_favorites',
  activity: 'activity',
};
