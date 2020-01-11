
import { server } from '../../../server';
import { queryParser } from '@celeri/query-parser';
import { validateParams, Req } from './params';
import { createFollowRecord } from './service';
import { authenticate } from '../../../middlewares/authenticate';

server
	.post<void, Req>('/follow/:userCode{[a-zA-Z0-9]{40}}')
	.use(authenticate({ required: true }))
	.use(validateParams)
	.use(async ({ req, res }) => {
		const autoAccepted = await createFollowRecord(req.user.userId, req.params.userCode);
		const statusCode = autoAccepted ? 201 : 202;
		const payload = JSON.stringify({
			status: autoAccepted ? 'following' : 'pending'
		});

		res.writeHead(statusCode, { 'content-type': 'application/json' });
		res.write(payload);
		res.end();
	});
