
import { format } from 'mysql2';
import { PreparedSelectQuery } from '@viva-eng/database';

export interface GetUserGroupParams {
	userId: string;
	userGroupId: string;
}

export interface GetUserGroupRecord {
	user_id: string;
}

export const getUserGroup = new PreparedSelectQuery<GetUserGroupParams, GetUserGroupRecord>({
	description: 'select ... from user_group, user where id = ?',
	prepared: `
		select
			user.user_id as user_id
		from user_group group
		left outer join user_group_user group_user
			on group_user.user_group_id = group.id
		left outer join user user
			on user.id = group_user.user_id
		where group.id = ?
			and group.owner_user_id = ?
	`,

	prepareParams(params: GetUserGroupParams) {
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
