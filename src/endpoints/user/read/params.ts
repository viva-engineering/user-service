
import { HttpError } from '@celeri/http-error';
import { MiddlewareInput } from '@celeri/http-server';
import { StringField } from '@viva-eng/payload-validator';

export interface Req {
	params?: Params
}

export interface Params {
	userCode: string;
}

const userCodeParam = new StringField({
	required: true,
	regex: /^[a-zA-Z0-9]{40}$/
});

export const validateParams = ({ req, res }: MiddlewareInput<void, Req>) => {
	const errors = userCodeParam.validate(req.params.userCode);

	// If there were validation failures, return an error to the client
	if (errors.length) {
		throw new HttpError(422, 'Invalid user code provided', { errors });
	}
};
