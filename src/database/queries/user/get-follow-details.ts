
import { format } from 'mysql2';
import { config } from '../../../config';
import { PreparedSelectQuery } from '@viva-eng/database';
import { VisibilityScheme } from '../../../reference-data';

export interface GetFollowDetailsParams {
	userCode: string;
}

export interface GetFollowDetailsRecord {
	user_id: string;
	user_code: string;
	auto_accept_follows: 0 | 1;
}

export const getFollowDetails = new PreparedSelectQuery<GetFollowDetailsParams, GetFollowDetailsRecord>({
	description: 'select ... from user where user_code = ?',
	prepared: `
		select
			user.id as user_id,
			user.user_code as user_code,
			pref.auto_accept_follows as auto_accept_follows
		from user user
		left outer join user_preferences pref
			on pref.user_id = user.id
		where user.user_code = ?
	`,

	prepareParams(params: GetFollowDetailsParams) {
		return [
			params.userCode
		];
	},

	maxRetries: 2,
	isRetryable() {
		return false;
	}
});
