
import { value } from '../../utils';
import { raw, format } from 'mysql2';
import { WriteQuery } from '@viva-eng/database';
import { VisibilityScheme } from '../../../reference-data';

export interface UpdateUserPrivacySettingsParams {
	userId: string;
	defaultPostVisibility?: VisibilityScheme;
	defaultImageVisibility?: VisibilityScheme;
	locationVisibility?: VisibilityScheme;
	birthdayVisibility?: VisibilityScheme;
	bioVisibility?: VisibilityScheme;
	emailVisibility?: VisibilityScheme;
	phoneVisibility?: VisibilityScheme;
	autoAcceptFollows?: boolean;
}

export const updateUserPrivacySettings = new WriteQuery<UpdateUserPrivacySettingsParams>({
	description: 'update user_preferences ... where user_id = ?',
	compile(params: UpdateUserPrivacySettingsParams) {
		return `
			update user_preferences
			set default_post_visibility_id = ${value('default_post_visibility_id', params.defaultPostVisibility)}
				default_image_visibility_id = ${value('default_image_visibility_id', params.defaultImageVisibility)}
				location_visibility_id = ${value('location_visibility_id', params.locationVisibility)}
				birthday_visibility_id = ${value('birthday_visibility_id', params.birthdayVisibility)}
				bio_visibility_id = ${value('bio_visibility_id', params.bioVisibility)}
				email_visibility_id = ${value('email_visibility_id', params.emailVisibility)}
				phone_visibility_id = ${value('phone_visibility_id', params.phoneVisibility)}
				auto_accept_follows = ${value('auto_accept_follows', params.autoAcceptFollows ? 1 : 0)}
			where user_id = ${format('?', [ params.userId ])}
		`;
	},

	maxRetries: 2,
	isRetryable() {
		return false;
	}
});
