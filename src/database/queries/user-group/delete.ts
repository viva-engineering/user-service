
import { format } from 'mysql2';
import { PreparedWriteQuery } from '@viva-eng/database';

export interface DeleteUserGroupParams {
	userId: string;
	userGroupId: string;
}

export const deleteUserGroup = new PreparedWriteQuery<DeleteUserGroupParams>({
	description: 'delete from user_group where id = ?',
	prepared: `
		delete user_group
		from user_group
		where id = ?
			and owner_user_id = ?
	`,

	prepareParams(params: DeleteUserGroupParams) {
		return [
			params.userGroupId,
			params.userId
		];
	},

	maxRetries: 2,
	isRetryable() {
		return false;
	}
});
