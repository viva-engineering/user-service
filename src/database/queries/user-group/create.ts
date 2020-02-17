
import { format } from 'mysql2';
import { PreparedWriteQuery } from '@viva-eng/database';

export interface CreateUserGroupParams {
	userId: string;
	name: string;
}

export const createUserGroup = new PreparedWriteQuery<CreateUserGroupParams>({
	description: 'insert into user_group ...',
	prepared: `
		insert into user_group
			(owner_user_id, name)
		values
			(?, ?)
	`,

	prepareParams(params: CreateUserGroupParams) {
		return [
			params.userId,
			params.name
		];
	},

	maxRetries: 2,
	isRetryable() {
		return false;
	}
});
