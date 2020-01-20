
import { Body } from './params';
import { db } from '../../../../database';
import { logger } from '../../../../logger';
import { updateUserProfile } from '../../../../database/queries/user-prefs/update-profile';
import { HttpError } from '@celeri/http-error';

enum ErrorCodes {
	UnexpectedError = 'UNEXPECTED_ERROR'
}

export const updateUserPreferences = async (userId: string, attrs: Body) => {
	try {
		await db.query(updateUserProfile, {
			userId,
			displayName: attrs.displayName,
			bio: attrs.bio,
			birthday: attrs.birthday,
			location: attrs.location
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
