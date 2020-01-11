
// import { config } from '../config';
// import { logger } from '../logger';
// import { shutdown } from '../utils/shutdown';
// import { RedisPool, RedisDB, RedisConfig } from '@viva-eng/redis-utils';

// const { host, port, password } = config.redis;

// const pool = (db: RedisDB, poolOptions: RedisConfig['pool']) => {
// 	const newPool = new RedisPool({
// 		host, port, db, password, logger,
// 		options: {
// 			// Need string numbers because user IDs are bigints
// 			string_numbers: true
// 		},
// 		pool: poolOptions
// 	});

// 	shutdown.addOnShutdown(async () => {
// 		logger.verbose('Waiting for redis pool to close before shutting down...', { host, port, db });

// 		await this.close();

// 		logger.verbose('Redis pool closed', { host, port, db });
// 	});

// 	return newPool;
// };

// export const followCachePool = pool(config.redis.dbs.followCache, config.redis.poolOptions);
