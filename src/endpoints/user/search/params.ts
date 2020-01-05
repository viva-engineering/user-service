
import { HttpError } from '@celeri/http-error';
import { MiddlewareInput } from '@celeri/http-server';
import { EmailField, PhoneField } from '@viva-eng/payload-validator';

export interface Req {
	query?: Query
}

export enum SearchField {
	Username = 'username',
	// DisplayName = 'displayName',
	Email = 'email',
	Phone = 'phone',
	UserCode = 'userCode'
}

export interface Query {
	username?: string;
	// displayName?: string;
	email?: string;
	phone?: string;
	userCode?: string;
}

const fields: Set<SearchField> = new Set([
	SearchField.Username,
	// SearchField.DisplayName,
	SearchField.Email,
	SearchField.Phone,
	SearchField.UserCode,
]);

const email = new EmailField({ });
const phone = new PhoneField({ });

export const validateQuery = ({ req, res }: MiddlewareInput<void, Req>) => {
	const query = req.query || { };
	const queryKeys = Object.keys(query) as SearchField[];

	if (! req.query || ! queryKeys.length) {
		throw new HttpError(400, 'Search query is required', {
			expected: {
				username: 'string',
				// displayName: 'string',
				email: 'string',
				phone: 'string',
				userCode: 'string'
			}
		});
	}

	if (queryKeys.length > 1) {
		throw new HttpError(422, 'Expected exactly one search criteria');
	}

	const searchField = queryKeys[0];

	if (! fields.has(searchField)) {
		throw new HttpError(422, `Unrecognized search filter ${searchField}`);
	}

	let errors: string[];

	switch (searchField) {
		case 'email':
			errors = email.validate(query.email);
			break;

		case 'phone':
			errors = phone.validate(query.phone);
			break;
	}

	// If there were validation failures, return an error to the client
	if (errors) {
		throw new HttpError(422, 'Invalid request body contents', { errors });
	}
};
