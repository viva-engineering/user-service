
import { format } from 'mysql2';
import { PreparedWriteQuery } from '@viva-eng/database';

export interface CreateFollowParams {
	followerUserId: string;
	followedUserId: string;
	approved: boolean;
}

export const createFollow = new PreparedWriteQuery<CreateFollowParams>({
	description: 'insert into follow ...',
	prepared: `
		insert into follow
			(follower_user_id, followed_user_id, approved)
		values
			(?, ?, ?)
	`,

	prepareParams(params: CreateFollowParams) {
		return [
			params.followerUserId,
			params.followedUserId,
			params.approved ? 1 : 0
		];
	},

	maxRetries: 2,
	isRetryable() {
		return false;
	}
});
