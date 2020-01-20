
import { Body } from './params';
import { db } from '../../../../database';
import { logger } from '../../../../logger';
import { updateUserPrivacySettings } from '../../../../database/queries/user-prefs/update-privacy-settings';
import { HttpError } from '@celeri/http-error';

enum ErrorCodes {
	UnexpectedError = 'UNEXPECTED_ERROR'
}

export const updateUserPreferences = async (userId: string, attrs: Body) => {
	try {
		await db.query(updateUserPrivacySettings, {
			userId,
			autoAcceptFollows: attrs.autoAcceptFollows,
			bioVisibility: attrs.bioVisibility,
			birthdayVisibility: attrs.birthdayVisibility,
			defaultImageVisibility: attrs.defaultImageVisibility,
			defaultPostVisibility: attrs.defaultPostVisibility,
			emailVisibility: attrs.emailVisibility,
			locationVisibility: attrs.locationVisibility,
			phoneVisibility: attrs.phoneVisibility
		});
	}

	catch (error) {
		if (error instanceof HttpError) {
			throw error;
		}

		logger.warn('Unexpected error while updating user profile', { error });

		throw new HttpError(500, 'Unexpected error', {
			code: ErrorCodes.UnexpectedError
		});
	}
};
