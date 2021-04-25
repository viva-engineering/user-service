
import { STATUS_CODES } from 'http';
import { HttpResponse } from '@viva-eng/http-client';

export class OutboundRequestError extends Error {
	public readonly code: string;
	public readonly status: number;
	public readonly response: any;

	constructor(message: string, details: OutboundRequestErrorDetails) {
		super(message);

		this.code = details.code;
		this.status = details.status;
		this.response = details.response;
	}

	static fromError(error: Error & { code?: string }) {
		return new OutboundRequestError(error.message, { code: error.code });
	}

	static fromResponse(res: HttpResponse<any>) {
		return new OutboundRequestError(`Received an HTTP ${res.status} (${STATUS_CODES[res.status]}) response`, {
			status: res.status,
			response: res.body.json
		});
	}
}

export interface OutboundRequestErrorDetails {
	code?: string;
	status?: number;
	response?: any;
}
