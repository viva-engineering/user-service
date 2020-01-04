
import { VisibilityScheme } from '../../../reference-data';

export interface SearchUsersRecord {
	username: string;
	display_name: string;
	email: string;
	email_visibility: VisibilityScheme;
	phone: string;
	phone_visibility: VisibilityScheme;
	location: string;
	location_visibility: VisibilityScheme;
	birthday: string;
	birthday_visibility: VisibilityScheme;
	user_code: string;

	/** Is the searching user following the searched user */
	following_status?: '0' | '1';

	/** Is the searched user following the searching user */
	followed_status?: '0' | '1';
}
