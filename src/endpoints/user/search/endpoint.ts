
import { server } from '../../../server';
import { queryParser } from '@celeri/query-parser';
import { validateQuery, Req, SearchField } from './params';
import { searchUsers } from './service';
import { authenticate } from '../../../middlewares/authenticate';

server
	.get<void, Req>('/user/search')
	.use(authenticate({ required: true }))
	.use(queryParser())
	.use(validateQuery)
	.use(async ({ req, res }) => {
		const searchField = Object.keys(req.query)[0] as SearchField;
		const searchValue = req.query[searchField];

		const users = await searchUsers(req.user, searchField, searchValue);
		const payload = JSON.stringify({ users });

		res.writeHead(201, { 'content-type': 'application/json' });
		res.write(payload);
		res.end();
	});
