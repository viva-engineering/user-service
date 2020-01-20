
import { value } from '../../utils';
import { raw, format } from 'mysql2';
import { WriteQuery } from '@viva-eng/database';

export interface UpdateUserProfileParams {
	userId: string;
	displayName?: string;
	bio?: string;
	location?: string;
	birthday?: string;
}

export const updateUserProfile = new WriteQuery<UpdateUserProfileParams>({
	description: 'update user_preferences ... where user_id = ?',

	compile(params: UpdateUserProfileParams) {
		return `
			update user_preferences
			set display_name = ${value('display_name', params.displayName)},
				bio = ${value('bio', params.bio)},
				location = ${value('location', params.location)},
				birthday = ${value('birthday', params.birthday)}
			where user_id = ${format('?', [ params.userId ])}
		`;
	},

	maxRetries: 2,
	isRetryable() {
		return false;
	}
});
