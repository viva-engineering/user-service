
import { format } from 'mysql2';
import { PreparedWriteQuery } from '@viva-eng/database';

export interface RenameUserGroupParams {
	userId: string;
	userGroupId: string;
	name: string;
}

export const renameUserGroup = new PreparedWriteQuery<RenameUserGroupParams>({
	description: 'update user_group set name = ? where id = ?',
	prepared: `
		update user_group
		set name = ?
		where id = ?
			and owner_user_id = ?
	`,

	prepareParams(params: RenameUserGroupParams) {
		return [
			params.name,
			params.userGroupId,
			params.userId
		];
	},

	maxRetries: 2,
	isRetryable() {
		return false;
	}
});
