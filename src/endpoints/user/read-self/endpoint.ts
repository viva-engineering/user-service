
import { server } from '../../../server';
import { lookupUser } from './service';
import { authenticate } from '../../../middlewares/authenticate';

// 
// TODO:
//   Take another pass at this endpoint; Refine what data needs to come back from
//   the DB query, and what data we should actually send back to the client
// 

server
	.get<void, { }>('/user/self')
	.use(authenticate({ required: true }))
	.use(async ({ req, res }) => {
		const user = await lookupUser(req.user);
		const payload = JSON.stringify(user);

		res.writeHead(200, { 'content-type': 'application/json' });
		res.write(payload);
		res.end();
	});
