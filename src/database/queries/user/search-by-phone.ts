
import { format } from 'mysql2';
import { config } from '../../../config';
import { PreparedSelectQuery } from '@viva-eng/database';
import { VisibilityScheme } from '../../../reference-data';
import { SearchUsersRecord } from './search-user-record';

export interface SearchUsersParams {
	userId: string;
	phone: string;
}

export const searchUsersByPhone = new PreparedSelectQuery<SearchUsersParams, SearchUsersRecord>({
	description: 'select ... from user where phone = ?',
	prepared: `
		select
			user.id as user_id,
			user.username as username,
			user.display_name as display_name,
			email_vis.description as email_visibility,
			user.phone as phone,
			phone_vis.description as phone_visibility,
			user.location as location,
			location_vis.description as location_visibility,
			user.birthday as birthday,
			birthday_vis.description as birthday_visibility,
			user.user_code as user_code,
			follow.approved as following_status,
			follower.approved as followed_status
		from user user
		left outer join follow follow
			on follow.follower_user_id = ?
			and follow.followed_user_id = user.id
		left outer join follow follower
			on follower.follower_user_id = user.id
			and follower.followed_user_id = ?
		left outer join visibility_scheme as email_vis
			on email_vis.id = user.email_visibility_id
		left outer join visibility_scheme as phone_vis
			on phone_vis.id = user.phone_visibility_id
		left outer join visibility_scheme as location_vis
			on location_vis.id = user.location_visibility_id
		left outer join visibility_scheme as birthday_vis
			on birthday_vis.id = user.birthday_visibility_id
		where user.phone = ?
			and user.phone_discoverable = 1
		limit 25
	`,

	prepareParams(params: SearchUsersParams) {
		return [
			params.userId,
			params.userId,
			params.phone
		];
	},

	maxRetries: 2,
	isRetryable() {
		return false;
	}
});
