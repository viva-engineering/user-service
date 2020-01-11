
// import { config } from '../../config';
// import { followCachePool } from '../../redis';
// import { RedisCache } from '@viva-eng/redis-utils';
// import { db } from '../../database';
// import { } from '../../database/queries/follow';

// const prefix = (prefix: string) => (key: string) => `${prefix}:${key}`;
// const serializeCommaDelimited = (value: string[]) => value.join(',');
// const deserializeCommaDelimited = (value: string) => value.split(',');

// export const followedByCache = new RedisCache<string[], string>(followCachePool, {
// 	ttl: config.caches.follow.ttl,
// 	serializeKey: prefix('followed_by'),
// 	serializeValue: serializeCommaDelimited,
// 	deserializeValue: deserializeCommaDelimited,
// 	async passthrough(userId: string) {
// 		// 
// 	}
// });

// export const followsCache = new RedisCache<string[], string>(followCachePool, {
// 	ttl: config.caches.follow.ttl,
// 	serializeKey: prefix('follows'),
// 	serializeValue: serializeCommaDelimited,
// 	deserializeValue: deserializeCommaDelimited,
// 	async passthrough(userId: string) {
// 		// 
// 	}
// });

// export const followedByPendingCache = new RedisCache<string[], string>(followCachePool, {
// 	ttl: config.caches.follow.ttl,
// 	serializeKey: prefix('followed_by_pending'),
// 	serializeValue: serializeCommaDelimited,
// 	deserializeValue: deserializeCommaDelimited,
// 	async passthrough(userId: string) {
// 		// 
// 	}
// });
