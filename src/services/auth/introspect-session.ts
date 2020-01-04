
import { authService } from './client';
import { UserRole } from '../../reference-data';
import { OutboundRequestError } from '../outbound-request-error';

export const introspectSession = async (token: string, requestFlowId: string) => {
	const res = await authService.get<IntrospectSessionPayload>('/session/introspect', {
		headers: {
			'authorization': `Bearer ${token}`,
			'x-request-flow-id': requestFlowId
		}
	});

	if (res.status !== 200) {
		throw OutboundRequestError.fromResponse(res);
	}

	return res.body.json;
};

export interface IntrospectSessionPayload {
	userId: string;
	userRole: UserRole;
	isElevated: boolean;
	applicationId?: string;
	token: string;
	ttl: number;
}
