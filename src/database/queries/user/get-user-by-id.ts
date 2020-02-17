
import { format } from 'mysql2';
import { config } from '../../../config';
import { PreparedSelectQuery } from '@viva-eng/database';
import { VisibilityScheme } from '../../../reference-data';

export interface GetUserParams {
	userId: string;
}

export interface GetUserRecord {
	user_id: string;
	username: string;
	user_code: string;
	display_name: string;
	email: string;
	phone: string;
	location: string;
	birthday: string;
	bio: string;
	email_visibility: VisibilityScheme;
	phone_visibility: VisibilityScheme;
	location_visibility: VisibilityScheme;
	birthday_visibility: VisibilityScheme;
	bio_visibility: VisibilityScheme;

	/** Is the searching user following the searched user */
	following_status?: '0' | '1';

	/** Is the searched user following the searching user */
	followed_status?: '0' | '1';
}


export const getUserById = new PreparedSelectQuery<GetUserParams, GetUserRecord>({
	description: 'select ... from user where id = ?',
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
			bio_vis.description as bio_visibility
		from user user
		left outer join user_preferences pref
			on pref.user_id = user.id
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
		where user.id = ?
	`,

	prepareParams(params: GetUserParams) {
		return [
			params.userId
		];
	},

	maxRetries: 2,
	isRetryable() {
		return false;
	}
});
