import { UserRelationship } from './UserRelationship';

export type Following = Pick<UserRelationship, 'created_at' | 'followed'>;
