
import { value } from '../../utils';
import { raw, format } from 'mysql2';
import { WriteQuery } from '@viva-eng/database';

export interface UpdateUserSettingsParams {
	userId: string;
	preferredLanguage?: string;
	explicitContentVisible?: boolean;
}

export const updateUserSettings = new WriteQuery<UpdateUserSettingsParams>({
	description: 'update user_preferences ... where user_id = ?',
	
	compile(params: UpdateUserSettingsParams) {
		return `
			update user_preferences
			set preferred_language = ${value('preferred_language', params.preferredLanguage)},
				explicit_content_visible = ${value('explicit_content_visible', params.explicitContentVisible ? 1 : 0)}
			where user_id = ${format('?', [ params.userId ])}
		`;
	},

	maxRetries: 2,
	isRetryable() {
		return false;
	}
});
