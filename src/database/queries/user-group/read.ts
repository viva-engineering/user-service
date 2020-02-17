
import { format } from 'mysql2';
import { PreparedSelectQuery } from '@viva-eng/database';

export interface GetUserGroupParams {
	userId: string;
	userGroupId: string;
}

export interface GetUserGroupRecord {
	id: string;
	name: string;
	age_seconds: string;
}

export const getUserGroup = new PreparedSelectQuery<GetUserGroupParams, GetUserGroupRecord>({
	description: 'select ... from user_group where id = ?',
	prepared: `
		select
			group.id as id,
			group.name as name,
			timestampdiff(second, group.create_timestamp, now()) as age_seconds
		from user_group group
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
