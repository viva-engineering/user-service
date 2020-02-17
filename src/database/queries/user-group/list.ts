
import { format } from 'mysql2';
import { PreparedSelectQuery } from '@viva-eng/database';

export interface ListUserGroupsParams {
	userId: string;
}

export interface ListUserGroupsRecord {
	id: string;
	owner_user_id: string;
	name: string;
	age_seconds: string;
}

export const listUserGroups = new PreparedSelectQuery<ListUserGroupsParams, ListUserGroupsRecord>({
	description: 'select ... from user_group where owner_user_id = ?',
	prepared: `
		select
			group.id as id,
			group.owner_user_id as owner_user_id,
			group.name as name,
			timestampdiff(second, group.create_timestamp, now()) as age_seconds
		from user_group group
		where group.owner_user_id = ?
	`,

	prepareParams(params: ListUserGroupsParams) {
		return [
			params.userId
		];
	},

	maxRetries: 2,
	isRetryable() {
		return false;
	}
});
