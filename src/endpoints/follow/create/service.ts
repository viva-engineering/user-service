
import { db } from '../../../database';
import { logger } from '../../../logger';
import { createFollow } from '../../../database/queries/follow/create';
import { getFollowDetails } from '../../../database/queries/user/get-follow-details';
import { HttpError } from '@celeri/http-error';
import { MysqlError } from 'mysql2';

enum ErrorCodes {
	UserNotFound = 'USER_NOT_FOUND',
	UniqueConflict = 'UNIQUE_RECORD_CONFLICT',
	UnexpectedError = 'UNEXPECTED_ERROR'
}

export const createFollowRecord = async (followerUserId: string, followedUserCode: string) => {
	try {
		const followDetails = await db.query(getFollowDetails, { userCode: followedUserCode });

		if (! followDetails.results.length) {
			throw new HttpError(404, `User with user code ${followedUserCode} not found`, {
				code: ErrorCodes.UserNotFound
			});
		}

		const followed = followDetails.results[0];
		const autoFollow = followed.auto_accept_follows === 1;

		await db.query(createFollow, {
			followerUserId: followerUserId,
			followedUserId: followed.user_id,
			approved: autoFollow
		});

		return autoFollow;
	}

	catch (error) {
		if (error instanceof HttpError) {
			throw error;
		}

		if (error.code === 'ER_DUP_UNIQUE') {
			throw new HttpError(409, 'Failed to follow user; Follow or follow request already exists', {
				code: ErrorCodes.UniqueConflict
			});
		}

		logger.warn('Unexpected error while following user', { error });

		throw new HttpError(500, 'Unexpected error', {
			code: ErrorCodes.UnexpectedError
		});
	}
};
