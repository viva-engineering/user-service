
import { logger } from '../../logger';
import { HttpClient } from '@viva-eng/http-client';
import { config } from '../../config';
import { parseUrl } from '../parse';

const parsed = parseUrl(config.services.auth.url);

export const authService = new HttpClient({
	hostname: parsed.hostname,
	port: parsed.port,
	ssl: parsed.ssl,
	logger
});
