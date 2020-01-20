
import { HttpError } from '@celeri/http-error';
import { MiddlewareInput } from '@celeri/http-server';
import { StringField, BooleanField } from '@viva-eng/payload-validator';
import { schemaValidator } from '../../../../utils/validate-schema';
import { VisibilityScheme, visibilitySchemes } from '../../../../reference-data';

export interface Req {
	body?: Body;
}

export interface Body {
	defaultPostVisibility?: VisibilityScheme;
	defaultImageVisibility?: VisibilityScheme;
	locationVisibility?: VisibilityScheme;
	birthdayVisibility?: VisibilityScheme;
	bioVisibility?: VisibilityScheme;
	emailVisibility?: VisibilityScheme;
	phoneVisibility?: VisibilityScheme;
	autoAcceptFollows?: boolean;
}

const visibility: Set<VisibilityScheme> = new Set(visibilitySchemes.enum());

const validate = schemaValidator<Body>({
	defaultPostVisibility: new StringField({ enum: visibility }),
	defaultImageVisibility: new StringField({ enum: visibility }),
	locationVisibility: new StringField({ enum: visibility }),
	birthdayVisibility: new StringField({ enum: visibility }),
	bioVisibility: new StringField({ enum: visibility }),
	emailVisibility: new StringField({ enum: visibility }),
	phoneVisibility: new StringField({ enum: visibility }),
	autoAcceptFollows: new BooleanField({ })
});

export const validateBody = ({ req, res }: MiddlewareInput<void, Req>) => {
	if (! req.body) {
		throw new HttpError(400, 'Request payload is required', {
			expected: {
				defaultPostVisibility: 'string',
				defaultImageVisibility: 'string',
				locationVisibility: 'string',
				birthdayVisibility: 'string',
				bioVisibility: 'string',
				emailVisibility: 'string',
				phoneVisibility: 'string',
				autoAcceptFollows: 'boolean'
			}
		});
	}

	const errors = validate(req.body);

	// If there were validation failures, return an error to the client
	if (errors) {
		throw new HttpError(422, 'Invalid request body contents', { errors });
	}
};
