
import { server } from '../../../server';
import { queryParser } from '@celeri/query-parser';
import { validateParams, Req } from './params';
import { lookupUserByUserCode } from './service';
import { authenticate } from '../../../middlewares/authenticate';

server
	.get<void, Req>('/user/:userCode{[a-zA-Z0-9]{40}}')
	.use(authenticate({ required: true }))
	.use(queryParser())
	.use(validateParams)
	.use(async ({ req, res }) => {
		const user = await lookupUserByUserCode(req.user, req.params.userCode);
		const payload = JSON.stringify(user);

		res.writeHead(200, { 'content-type': 'application/json' });
		res.write(payload);
		res.end();
	});
