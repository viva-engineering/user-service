
import { Body } from './params';
import { db } from '../../../../database';
import { logger } from '../../../../logger';
import { updateUserSettings } from '../../../../database/queries/user-prefs/update-settings';
import { HttpError } from '@celeri/http-error';

enum ErrorCodes {
	UnexpectedError = 'UNEXPECTED_ERROR'
}

export const updateUserPreferences = async (userId: string, attrs: Body) => {
	try {
		await db.query(updateUserSettings, {
			userId,
			preferredLanguage: attrs.preferredLanguage,
			explicitContentVisible: attrs.explicitContentVisible
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
