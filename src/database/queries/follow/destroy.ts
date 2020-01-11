
import { format } from 'mysql2';
import { PreparedWriteQuery } from '@viva-eng/database';

export interface DestroyFollowParams {
	followerUserId: string;
	followedUserId: string;
}

export const destroyFollow = new PreparedWriteQuery<DestroyFollowParams>({
	description: 'delete from follow where follower_user_id = ? and followed_user_id = ?',
	prepared: `
		delete follow
		from follow
		where follower_user_id = ?
			and followed_user_id = ?
	`,

	prepareParams(params: DestroyFollowParams) {
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
