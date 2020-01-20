
import { server } from '../../../../server';
import { bodyParser } from '@celeri/body-parser';
import { validateBody, Req } from './params';
import { updateUserPreferences } from './service';
import { authenticate } from '../../../../middlewares/authenticate';

server
	.patch<void, Req>('/user/privacy')
	.use(authenticate({ required: true }))
	.use(bodyParser({ maxSize: '1kb' }))
	.use(validateBody)
	.use(async ({ req, res }) => {
		await updateUserPreferences(req.user.userId, req.body);
		
		res.writeHead(200);
		res.end();
	});
