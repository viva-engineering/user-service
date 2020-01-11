
import { format } from 'mysql2';
import { PreparedWriteQuery } from '@viva-eng/database';

export interface ApproveFollowParams {
	followerUserId: string;
	followedUserId: string;
}

export const approveFollow = new PreparedWriteQuery<ApproveFollowParams>({
	description: 'update follow set approved = 1 where follower_user_id = ? and followed_user_id = ?',
	prepared: `
		update follow
		set approved = 1
		where follower_user_id = ?
			and followed_user_id = ?
	`,

	prepareParams(params: ApproveFollowParams) {
		return [
			params.followerUserId,
			params.followedUserId
		];
	},

	maxRetries: 2,
	isRetryable() {
		return false;
	}
});
