
import { parse } from 'url';

export const parseUrl = (url: string) => {
	const parsed = parse(url);

	const ssl = parsed.protocol === 'https:';
	const hostname = parsed.hostname;
	const port = parsed.port
		? parseInt(parsed.port, 10)
		: ssl ? 443 : 80;

	return { ssl, hostname, port };
};
