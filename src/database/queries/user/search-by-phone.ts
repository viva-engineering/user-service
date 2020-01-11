
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
			user.user_code as user_code,
			pref.display_name as display_name,
			user.email as email,
			user.phone as phone,
			pref.location as location,
			pref.birthday as birthday,
			pref.bio as bio,
			email_vis.description as email_visibility,
			phone_vis.description as phone_visibility,
			location_vis.description as location_visibility,
			birthday_vis.description as birthday_visibility,
			bio_vis.description as bio_visibility,
			follow.approved as following_status,
			follower.approved as followed_status
		from user user
		left outer join user_preferences pref
			on pref.user_id = user.id
		left outer join follow follow
			on follow.follower_user_id = ?
			and follow.followed_user_id = user.id
		left outer join follow follower
			on follower.follower_user_id = user.id
			and follower.followed_user_id = ?
		left outer join visibility_scheme as email_vis
			on email_vis.id = pref.email_visibility_id
		left outer join visibility_scheme as phone_vis
			on phone_vis.id = pref.phone_visibility_id
		left outer join visibility_scheme as location_vis
			on location_vis.id = pref.location_visibility_id
		left outer join visibility_scheme as birthday_vis
			on birthday_vis.id = pref.birthday_visibility_id
		left outer join visibility_scheme as bio_vis
			on bio_vis.id = pref.bio_visibility_id
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
