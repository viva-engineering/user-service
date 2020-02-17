
import { db } from '../../../database';
import { PoolConnection } from 'mysql2';
import { TransactionType, SelectQueryResult } from '@viva-eng/database';
import { getUserById } from '../../../database/queries/user/get-user-by-id';
import { HttpError } from '@celeri/http-error';
import { logger } from '../../../logger';
import { AuthenticatedUser } from '../../../middlewares/authenticate';

enum ErrorCodes {
	NotFound = 'USER_NOT_FOUND',
	UnexpectedError = 'UNEXPECTED_ERROR'
}

interface GetUserResult {
	self: true;
	username: string;
	displayName: string;
	email?: string;
	phone?: string;
	location?: string;
	birthday?: string;
	bio?: string;
	userCode: string;
}

export const lookupUser = async (user: AuthenticatedUser) => {
	try {
		const records = await db.query(getUserById, { userId: user.userId });

		if (! records.results.length) {
			throw new HttpError(404, 'User not found', {
				code: ErrorCodes.NotFound
			});
		}

		const record = records.results[0];

		const result: GetUserResult = {
			self: true,
			username: record.username,
			displayName: record.display_name || record.username,
			userCode: record.user_code,
			email: record.email,
			phone: record.phone,
			location: record.location,
			birthday: record.birthday,
			bio: record.bio
		};

		return result;
	}

	catch (error) {
		if (error instanceof HttpError) {
			throw error;
		}

		logger.error('Unexpected error while attempting to search for users', { error });

		throw new HttpError(500, 'Unexpected error', {
			code: ErrorCodes.UnexpectedError
		});
	}
};
