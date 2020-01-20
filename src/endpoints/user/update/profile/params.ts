
import { HttpError } from '@celeri/http-error';
import { MiddlewareInput } from '@celeri/http-server';
import { StringField } from '@viva-eng/payload-validator';
import { schemaValidator } from '../../../../utils/validate-schema';

export interface Req {
	body?: Body;
}

export interface Body {
	displayName?: string;
	bio?: string;
	location?: string;
	birthday?: string;
}

const validate = schemaValidator<Body>({
	displayName: new StringField({ maxLength: 60 }),
	bio: new StringField({ maxLength: 250 }),
	location: new StringField({ maxLength: 60 }),
	birthday: new StringField({ regex: /^([12][0-9]{3})-(0[1-9]|10|11|12)-(0[1-9]|[12][0-9]|30|31)$/ })
});

export const validateBody = ({ req, res }: MiddlewareInput<void, Req>) => {
	if (! req.body) {
		throw new HttpError(400, 'Request payload is required', {
			expected: {
				displayName: 'string',
				bio: 'string',
				location: 'string',
				birthday: 'string'
			}
		});
	}

	const errors = validate(req.body);

	// If there were validation failures, return an error to the client
	if (errors) {
		throw new HttpError(422, 'Invalid request body contents', { errors });
	}
};
