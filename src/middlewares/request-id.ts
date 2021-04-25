
import { randomBytes } from 'crypto';

const charsets = {
	alphaLower: 'abcdefghijklmnopqrstuvwxyz',
	alphaUpper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
	numeric: '1234567890',
	symbol: '!@#$%^&*()/?;:|[]-=_+`~.,><'
};

const requestIdCharset = charsets.alphaUpper + charsets.numeric;

declare module '@celeri/http-server' {
	interface Request {
		requestId: string;
		requestFlowId: string;
	}
}

export const requestIdMiddleware = async ({ req, res }) => {
	const requestFlowId = req.headers['x-request-flow-id'] || generateRequestId();

	[ req.requestId, req.requestFlowId ] = await Promise.all([
		generateRequestId(),
		requestFlowId
	]);
};

/**
 * Generates a random ID used to uniquely identify a particular request in logs
 */
export const generateRequestId = () : Promise<string> => {
	return randomString(10, requestIdCharset);
};

/**
 * Generates a random string of the given length, taken from the given character set
 *
 * @param length The length in bytes of the output string
 * @param charset The set of valid characters to choose from
 */
export const randomString = (length: number, charset: string) : Promise<string> => {
	return new Promise((resolve, reject) => {
		const chars: string[] = new Array(length);

		randomBytes(length, (error, bytes) => {
			if (error) {
				return reject(error);
			}

			for (let i = 0; i < length; i++) {
				chars[i] = charset[bytes[i] % charset.length];
			}

			resolve(chars.join(''));
		});
	});
};