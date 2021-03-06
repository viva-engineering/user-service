
import { PoolConfig } from 'mysql2';
import { cast } from '@viva-eng/config-loader';
import { RedisDB, RedisConfig } from '@viva-eng/redis-utils';

interface ServiceConfig {
	url: string;
}

export interface Config {
	http: {
		port: number;
		address: string;
	};

	logging: {
		colors: boolean;
		output: 'json' | 'pretty';
		logLevel: 'error' | 'warn' | 'info' | 'verbose' | 'debug' | 'silly';
		stackTraceLimit?: number;
	};

	database: {
		master: PoolConfig;
		replica: PoolConfig;
	};

	redis: {
		host: string;
		port: number;
		password: string;
		dbs: {
			followCache: RedisDB;
		},
		poolOptions: RedisConfig['pool'];
	};

	caches: {
		follow: {
			ttl: number;
		};
	};

	refTables: {
		refreshInterval: number;
	};

	services: {
		auth: ServiceConfig;
	};
}

export const config: Config = {
	http: {
		port: cast.number(process.env.user_srv_http_port, 8080),
		address: cast.string(process.env.user_srv_http_addr, '0.0.0.0')
	},

	logging: {
		colors: cast.bool(process.env.user_srv_logging_color, false),
		output: 'pretty',
		logLevel: cast.string(process.env.user_srv_logging_level, 'info'),
		stackTraceLimit: cast.number(process.env.user_srv_logging_stack_length, 10),
	},

	database: {
		master: {
			host: cast.string(process.env.db_users_master_host),
			port: cast.number(process.env.db_users_master_port),
			user: cast.string(process.env.user_srv_db_users_user),
			password: cast.string(process.env.user_srv_db_users_pass),
			database: cast.string(process.env.db_users_database),
			connectionLimit: cast.number(process.env.user_srv_db_users_master_connection_limit, 100),
			supportBigNumbers: true,
			bigNumberStrings: true,
			dateStrings: true,
			charset: 'utf8mb4_unicode_ci'
		},
		replica: {
			host: cast.string(process.env.db_users_replica_host),
			port: cast.number(process.env.db_users_replica_port),
			user: cast.string(process.env.user_srv_db_users_user),
			password: cast.string(process.env.user_srv_db_users_pass),
			database: cast.string(process.env.db_users_database),
			connectionLimit: cast.number(process.env.user_srv_db_users_replica_connection_limit, 100),
			supportBigNumbers: true,
			bigNumberStrings: true,
			dateStrings: true,
			charset: 'utf8mb4_unicode_ci'
		}
	},

	redis: {
		host: cast.string(process.env.redis_host),
		port: cast.number(process.env.redis_port),
		password: cast.string(process.env.redis_pass),
		dbs: {
			followCache: cast.number(process.env.redis_db_follow_cache)
		},
		poolOptions: {
			min: cast.number(process.env.user_srv_redis_pool_min),
			max: cast.number(process.env.user_srv_redis_pool_max)
		}
	},

	caches: {
		follow: {
			ttl: 60 * 60 * 24
		}
	},

	refTables: {
		refreshInterval: cast.number(process.env.user_srv_ref_data_refresh_interval, 86400000)
	},

	services: {
		auth: {
			url: cast.string(process.env.auth_service_endpoint)
		}
	}
};
