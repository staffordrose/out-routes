// Generated by Xata Codegen 0.21.0. Please do not edit.
import { buildClient } from "@xata.io/client";
import type {
  BaseClientOptions,
  SchemaInference,
  XataRecord,
} from "@xata.io/client";

const tables = [
  {
    name: "nextauth_users",
    columns: [
      { name: "email", type: "email" },
      { name: "emailVerified", type: "datetime" },
      { name: "name", type: "string" },
      { name: "image", type: "string" },
    ],
  },
  {
    name: "nextauth_users_accounts",
    columns: [
      { name: "user", type: "link", link: { table: "nextauth_users" } },
      { name: "account", type: "link", link: { table: "nextauth_accounts" } },
    ],
  },
  {
    name: "nextauth_accounts",
    columns: [
      { name: "user", type: "link", link: { table: "nextauth_users" } },
      { name: "type", type: "string" },
      { name: "provider", type: "string" },
      { name: "providerAccountId", type: "string" },
      { name: "refresh_token", type: "string" },
      { name: "access_token", type: "string" },
      { name: "expires_at", type: "int" },
      { name: "token_type", type: "string" },
      { name: "scope", type: "string" },
      { name: "id_token", type: "text" },
      { name: "session_state", type: "string" },
    ],
  },
  {
    name: "nextauth_users_sessions",
    columns: [
      { name: "user", type: "link", link: { table: "nextauth_users" } },
      { name: "session", type: "link", link: { table: "nextauth_sessions" } },
    ],
  },
  {
    name: "nextauth_sessions",
    columns: [
      { name: "sessionToken", type: "string" },
      { name: "expires", type: "datetime" },
      { name: "user", type: "link", link: { table: "nextauth_users" } },
    ],
  },
  {
    name: "nextauth_verificationTokens",
    columns: [
      { name: "identifier", type: "string" },
      { name: "token", type: "string" },
      { name: "expires", type: "datetime" },
    ],
  },
  {
    name: "users",
    columns: [
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" },
      {
        name: "auth",
        type: "link",
        link: { table: "nextauth_users" },
        unique: true,
      },
      { name: "username", type: "string", unique: true },
      { name: "username_updated_at", type: "datetime" },
      { name: "name", type: "string" },
      { name: "location", type: "string" },
      { name: "bio", type: "text" },
      { name: "company", type: "string" },
      { name: "image_full", type: "string" },
      { name: "image_thumb_360", type: "string" },
      { name: "image_thumb_240", type: "string" },
      { name: "image_thumb_120", type: "string" },
      { name: "image_thumb_64", type: "string" },
      { name: "image_thumb_32", type: "string" },
      { name: "image_thumb_16", type: "string" },
      { name: "stats_followers", type: "int" },
      { name: "stats_following", type: "int" },
      { name: "stats_favorites", type: "int" },
      { name: "stats_routes", type: "int" },
      { name: "stats_commits", type: "int" },
    ],
  },
  {
    name: "user_relationships",
    columns: [
      { name: "created_at", type: "datetime" },
      { name: "follower", type: "link", link: { table: "users" } },
      { name: "followed", type: "link", link: { table: "users" } },
    ],
  },
  {
    name: "routes",
    columns: [
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" },
      { name: "commit_id", type: "string" },
      { name: "fork_id", type: "string" },
      { name: "fork_commit_id", type: "string" },
      { name: "owner", type: "link", link: { table: "users" } },
      { name: "is_private", type: "bool", notNull: true, defaultValue: "true" },
      { name: "slug", type: "string" },
      { name: "title", type: "string" },
      { name: "title_alt", type: "multiple" },
      { name: "activity_type", type: "string" },
      { name: "region", type: "string" },
      { name: "country", type: "string" },
      { name: "image_id", type: "string" },
      { name: "image_full", type: "string" },
      { name: "image_og", type: "string" },
      { name: "image_banner", type: "string" },
      { name: "image_card_banner", type: "string" },
      { name: "image_thumb_360", type: "string" },
      { name: "image_thumb_240", type: "string" },
      { name: "image_thumb_120", type: "string" },
      { name: "stats_layers", type: "int" },
      { name: "stats_features", type: "int" },
      { name: "stats_members", type: "int" },
      { name: "stats_contributors", type: "int" },
      { name: "stats_commits", type: "int" },
      { name: "stats_forks", type: "int" },
      { name: "stats_favorites", type: "int" },
      { name: "map_bounding_box", type: "text" },
      { name: "map_start_lng", type: "float" },
      { name: "map_start_lat", type: "float" },
      { name: "map_start_ele", type: "float" },
      { name: "map_end_lng", type: "float" },
      { name: "map_end_lat", type: "float" },
      { name: "map_end_ele", type: "float" },
      { name: "map_distance", type: "float" },
      { name: "summary", type: "text" },
      { name: "static_image_id", type: "string" },
      { name: "static_image_og", type: "string" },
      { name: "static_image_banner", type: "string" },
      { name: "static_image_card_banner", type: "string" },
      { name: "static_image_thumb_360", type: "string" },
      { name: "static_image_thumb_240", type: "string" },
      { name: "static_image_thumb_120", type: "string" },
    ],
  },
  {
    name: "route_layers",
    columns: [
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" },
      { name: "route", type: "link", link: { table: "routes" } },
      { name: "order", type: "int", notNull: true, defaultValue: "0" },
      { name: "title", type: "string" },
      { name: "color", type: "string" },
      { name: "symbol", type: "string" },
    ],
  },
  {
    name: "route_features",
    columns: [
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" },
      { name: "route", type: "link", link: { table: "routes" } },
      { name: "layer", type: "link", link: { table: "route_layers" } },
      { name: "order", type: "int", notNull: true, defaultValue: "0" },
      { name: "type", type: "string" },
      { name: "coordinates", type: "text" },
      { name: "title", type: "string" },
      { name: "color", type: "string" },
      { name: "symbol", type: "string" },
      { name: "description", type: "text" },
      { name: "ele_start", type: "float" },
      { name: "ele_end", type: "float" },
      { name: "distance", type: "float" },
      { name: "image_id", type: "string" },
      { name: "image_full", type: "string" },
      { name: "image_large", type: "string" },
      { name: "image_card_banner", type: "string" },
      { name: "image_thumb_360", type: "string" },
      { name: "image_thumb_240", type: "string" },
      { name: "image_thumb_120", type: "string" },
      { name: "area", type: "float" },
    ],
  },
  {
    name: "route_commits",
    columns: [
      { name: "created_at", type: "datetime" },
      { name: "parent_id", type: "string" },
      { name: "pull_id", type: "string" },
      { name: "route", type: "link", link: { table: "routes" } },
      { name: "user", type: "link", link: { table: "users" } },
      { name: "title", type: "string" },
    ],
  },
  {
    name: "route_commit_items",
    columns: [
      { name: "created_at", type: "datetime" },
      { name: "commit", type: "link", link: { table: "route_commits" } },
      { name: "action", type: "string" },
      { name: "payload", type: "text" },
      { name: "resource_id", type: "string" },
      { name: "resource_table", type: "string" },
    ],
  },
  {
    name: "route_pulls",
    columns: [
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" },
      { name: "route", type: "link", link: { table: "routes" } },
      { name: "user", type: "link", link: { table: "users" } },
      { name: "title", type: "string" },
      { name: "status", type: "string", notNull: true, defaultValue: "open" },
    ],
  },
  {
    name: "route_pull_items",
    columns: [
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" },
      { name: "pull", type: "link", link: { table: "route_pulls" } },
      { name: "action", type: "string" },
      { name: "payload", type: "text" },
      { name: "resource_id", type: "string" },
      { name: "resource_table", type: "string" },
    ],
  },
  {
    name: "route_pull_comments",
    columns: [
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" },
      { name: "pull", type: "link", link: { table: "route_pulls" } },
      { name: "user", type: "link", link: { table: "users" } },
      { name: "message", type: "text" },
    ],
  },
  {
    name: "route_threads",
    columns: [
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" },
      { name: "route", type: "link", link: { table: "routes" } },
      { name: "user", type: "link", link: { table: "users" } },
      { name: "message", type: "text" },
      { name: "status", type: "string", notNull: true, defaultValue: "open" },
    ],
  },
  {
    name: "route_thread_comments",
    columns: [
      { name: "created_at", type: "datetime" },
      { name: "updated_at", type: "datetime" },
      { name: "thread", type: "link", link: { table: "route_threads" } },
      { name: "user", type: "link", link: { table: "users" } },
      { name: "message", type: "text" },
    ],
  },
  {
    name: "route_members",
    columns: [
      { name: "created_at", type: "datetime" },
      { name: "route", type: "link", link: { table: "routes" } },
      { name: "user", type: "link", link: { table: "users" } },
      {
        name: "status",
        type: "string",
        notNull: true,
        defaultValue: "pending",
      },
      { name: "role", type: "string", notNull: true, defaultValue: "viewer" },
    ],
  },
  {
    name: "route_contributors",
    columns: [
      { name: "created_at", type: "datetime" },
      { name: "contributed_at", type: "datetime" },
      { name: "route", type: "link", link: { table: "routes" } },
      { name: "user", type: "link", link: { table: "users" } },
      { name: "stats_contributions", type: "int" },
    ],
  },
  {
    name: "route_favorites",
    columns: [
      { name: "created_at", type: "datetime" },
      { name: "route", type: "link", link: { table: "routes" } },
      { name: "user", type: "link", link: { table: "users" } },
    ],
  },
  {
    name: "activity",
    columns: [
      { name: "created_at", type: "datetime" },
      { name: "user", type: "link", link: { table: "users" } },
      { name: "creator", type: "link", link: { table: "users" } },
      { name: "resource_id", type: "string" },
      { name: "resource_table", type: "string" },
      { name: "action", type: "string" },
      { name: "payload", type: "text" },
    ],
  },
] as const;

export type SchemaTables = typeof tables;
export type InferredTypes = SchemaInference<SchemaTables>;

export type NextauthUsers = InferredTypes["nextauth_users"];
export type NextauthUsersRecord = NextauthUsers & XataRecord;

export type NextauthUsersAccounts = InferredTypes["nextauth_users_accounts"];
export type NextauthUsersAccountsRecord = NextauthUsersAccounts & XataRecord;

export type NextauthAccounts = InferredTypes["nextauth_accounts"];
export type NextauthAccountsRecord = NextauthAccounts & XataRecord;

export type NextauthUsersSessions = InferredTypes["nextauth_users_sessions"];
export type NextauthUsersSessionsRecord = NextauthUsersSessions & XataRecord;

export type NextauthSessions = InferredTypes["nextauth_sessions"];
export type NextauthSessionsRecord = NextauthSessions & XataRecord;

export type NextauthVerificationTokens =
  InferredTypes["nextauth_verificationTokens"];
export type NextauthVerificationTokensRecord = NextauthVerificationTokens &
  XataRecord;

export type Users = InferredTypes["users"];
export type UsersRecord = Users & XataRecord;

export type UserRelationships = InferredTypes["user_relationships"];
export type UserRelationshipsRecord = UserRelationships & XataRecord;

export type Routes = InferredTypes["routes"];
export type RoutesRecord = Routes & XataRecord;

export type RouteLayers = InferredTypes["route_layers"];
export type RouteLayersRecord = RouteLayers & XataRecord;

export type RouteFeatures = InferredTypes["route_features"];
export type RouteFeaturesRecord = RouteFeatures & XataRecord;

export type RouteCommits = InferredTypes["route_commits"];
export type RouteCommitsRecord = RouteCommits & XataRecord;

export type RouteCommitItems = InferredTypes["route_commit_items"];
export type RouteCommitItemsRecord = RouteCommitItems & XataRecord;

export type RoutePulls = InferredTypes["route_pulls"];
export type RoutePullsRecord = RoutePulls & XataRecord;

export type RoutePullItems = InferredTypes["route_pull_items"];
export type RoutePullItemsRecord = RoutePullItems & XataRecord;

export type RoutePullComments = InferredTypes["route_pull_comments"];
export type RoutePullCommentsRecord = RoutePullComments & XataRecord;

export type RouteThreads = InferredTypes["route_threads"];
export type RouteThreadsRecord = RouteThreads & XataRecord;

export type RouteThreadComments = InferredTypes["route_thread_comments"];
export type RouteThreadCommentsRecord = RouteThreadComments & XataRecord;

export type RouteMembers = InferredTypes["route_members"];
export type RouteMembersRecord = RouteMembers & XataRecord;

export type RouteContributors = InferredTypes["route_contributors"];
export type RouteContributorsRecord = RouteContributors & XataRecord;

export type RouteFavorites = InferredTypes["route_favorites"];
export type RouteFavoritesRecord = RouteFavorites & XataRecord;

export type Activity = InferredTypes["activity"];
export type ActivityRecord = Activity & XataRecord;

export type DatabaseSchema = {
  nextauth_users: NextauthUsersRecord;
  nextauth_users_accounts: NextauthUsersAccountsRecord;
  nextauth_accounts: NextauthAccountsRecord;
  nextauth_users_sessions: NextauthUsersSessionsRecord;
  nextauth_sessions: NextauthSessionsRecord;
  nextauth_verificationTokens: NextauthVerificationTokensRecord;
  users: UsersRecord;
  user_relationships: UserRelationshipsRecord;
  routes: RoutesRecord;
  route_layers: RouteLayersRecord;
  route_features: RouteFeaturesRecord;
  route_commits: RouteCommitsRecord;
  route_commit_items: RouteCommitItemsRecord;
  route_pulls: RoutePullsRecord;
  route_pull_items: RoutePullItemsRecord;
  route_pull_comments: RoutePullCommentsRecord;
  route_threads: RouteThreadsRecord;
  route_thread_comments: RouteThreadCommentsRecord;
  route_members: RouteMembersRecord;
  route_contributors: RouteContributorsRecord;
  route_favorites: RouteFavoritesRecord;
  activity: ActivityRecord;
};

const DatabaseClient = buildClient();

const defaultOptions = {
  databaseURL:
    "https://Stafford-Rose-s-workspace-a7gacv.us-west-2.xata.sh/db/out-routes",
};

export class XataClient extends DatabaseClient<DatabaseSchema> {
  constructor(options?: BaseClientOptions) {
    super({ ...defaultOptions, ...options }, tables);
  }
}

let instance: XataClient | undefined = undefined;

export const getXataClient = () => {
  if (instance) return instance;

  instance = new XataClient();
  return instance;
};
