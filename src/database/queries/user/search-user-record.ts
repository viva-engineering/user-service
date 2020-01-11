
import { VisibilityScheme } from '../../../reference-data';

export interface SearchUsersRecord {
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
