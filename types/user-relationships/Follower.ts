import { UserRelationship } from './UserRelationship';

export type Follower = Pick<UserRelationship, 'created_at' | 'follower'>;
