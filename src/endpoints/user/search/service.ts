
import { db } from '../../../database';
import { PoolConnection } from 'mysql2';
import { TransactionType, SelectQueryResult } from '@viva-eng/database';
import { searchUsersByUsername } from '../../../database/queries/user/search-by-username';
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
	username: string;
	displayName: string;
	email?: string;
	phone?: string;
	location?: string;
	birthday?: string;
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
		}

		return records.results.map((record) => {
			const followingThem = followStatus(record.following_status);

			const user: SearchUserResult = {
				username: record.username,
				displayName: record.display_name || record.username,
				userCode: record.user_code,
				followingYou: followStatus(record.followed_status),
				followingThem: followingThem
			};

			if (record.email && canView(record.email_visibility, followingThem === true)) {
				user.email = record.email;
			}

			if (record.phone && canView(record.phone_visibility, followingThem === true)) {
				user.phone = record.phone;
			}

			if (record.location && canView(record.location_visibility, followingThem === true)) {
				user.location = record.location;
			}

			if (record.birthday && canView(record.birthday_visibility, followingThem === true)) {
				user.birthday = record.birthday;
			}

			return user;
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
