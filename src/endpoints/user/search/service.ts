
import { db } from '../../../database';
import { PoolConnection } from 'mysql2';
import { TransactionType, SelectQueryResult } from '@viva-eng/database';
import { searchUsersByUsername } from '../../../database/queries/user/search-by-username';
import { searchUsersByUserCode } from '../../../database/queries/user/search-by-user-code';
import { searchUsersByEmail } from '../../../database/queries/user/search-by-email';
import { searchUsersByPhone } from '../../../database/queries/user/search-by-phone';
import { SearchUsersRecord } from '../../../database/queries/user/search-user-record';
import { HttpError } from '@celeri/http-error';
import { logger } from '../../../logger';
import { AuthenticatedUser } from '../../../middlewares/authenticate';
import { SearchField } from './params';
import { VisibilityScheme } from '../../../reference-data';

enum ErrorCodes {
	UnexpectedError = 'UNEXPECTED_ERROR'
}

interface SearchUserResult {
	self?: boolean;
	username: string;
	displayName: string;
	email?: string;
	phone?: string;
	location?: string;
	birthday?: string;
	bio?: string;
	userCode: string;
	followingYou: boolean | 'pending';
	followingThem: boolean | 'pending';
}

export const searchUsers = async (user: AuthenticatedUser, searchField: SearchField, value: string) => {
	let records: SelectQueryResult<SearchUsersRecord>;

	try {
		switch (searchField) {
			case 'username':
				records = await db.query(searchUsersByUsername, { userId: user.userId, username: value });
				break;

			// case 'displayName':
			// 	// 
			// 	break;

			case 'email':
				records = await db.query(searchUsersByEmail, { userId: user.userId, email: value });
				break;

			case 'phone':
				records = await db.query(searchUsersByPhone, { userId: user.userId, phone: value });
				break;

			case 'userCode':
				records = await db.query(searchUsersByUserCode, { userId: user.userId, userCode: value });
				break;
		}

		return records.results.map((record) => {
			const isSelf = record.user_id === user.userId;
			const followingThem = followStatus(record.following_status);

			const result: SearchUserResult = {
				username: record.username,
				displayName: record.display_name || record.username,
				userCode: record.user_code,
				followingYou: followStatus(record.followed_status),
				followingThem: followingThem
			};

			if (isSelf) {
				result.self = true;
			}

			if (record.email && isSelf || canView(record.email_visibility, followingThem === true)) {
				result.email = record.email;
			}

			if (record.phone && isSelf || canView(record.phone_visibility, followingThem === true)) {
				result.phone = record.phone;
			}

			if (record.location && isSelf || canView(record.location_visibility, followingThem === true)) {
				result.location = record.location;
			}

			if (record.birthday && isSelf || canView(record.birthday_visibility, followingThem === true)) {
				result.birthday = record.birthday;
			}

			if (record.bio && isSelf || canView(record.bio_visibility, followingThem === true)) {
				result.bio = record.bio;
			}

			return result;
		});
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

const followStatus = (approved: null | '0' | '1') : boolean | 'pending' => {
	if (approved == null) {
		return false;
	}

	if (approved === '1') {
		return true;
	}

	return 'pending';
};

const canView = (visibility: VisibilityScheme, following: boolean) => {
	switch (visibility) {
		case VisibilityScheme.Private:
			return false;

		case VisibilityScheme.Public:
			return true;

		case VisibilityScheme.VisibleToFollowers:
			return following;
	}
};
