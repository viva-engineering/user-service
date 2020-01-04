
import { PoolConfig } from 'mysql2';
import { cast } from '@viva-eng/config-loader';

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
			dateStrings: true
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
			dateStrings: true
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
