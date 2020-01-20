
import { HttpError } from '@celeri/http-error';
import { MiddlewareInput } from '@celeri/http-server';
import { StringField, BooleanField } from '@viva-eng/payload-validator';
import { schemaValidator } from '../../../../utils/validate-schema';
import { LanguageCode, languageCodes } from '../../../../reference-data';

export interface Req {
	body?: Body;
}

export interface Body {
	preferredLanguage?: LanguageCode;
	explicitContentVisible?: boolean;
}

const validate = schemaValidator<Body>({
	preferredLanguage: new StringField({ enum: languageCodes }),
	explicitContentVisible: new BooleanField({ })
});

export const validateBody = ({ req, res }: MiddlewareInput<void, Req>) => {
	if (! req.body) {
		throw new HttpError(400, 'Request payload is required', {
			expected: {
				preferredLanguage: 'string',
				explicitContentVisible: 'boolean'
			}
		});
	}

	const errors = validate(req.body);

	// If there were validation failures, return an error to the client
	if (errors) {
		throw new HttpError(422, 'Invalid request body contents', { errors });
	}
};
