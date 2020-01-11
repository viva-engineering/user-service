
const endpoints: string[] = [
	'./healthcheck/endpoint',
	'./user/read/endpoint',
	'./user/search/endpoint',
	'./follow/create/endpoint'
];

export const loadEndpoints = () => {
	endpoints.forEach((file) => require(file));
};
