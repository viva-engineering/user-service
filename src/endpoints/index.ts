
const endpoints: string[] = [
	'./healthcheck/endpoint',
	'./user/read/endpoint',
	'./user/search/endpoint',
	'./user/update/profile/endpoint',
	'./user/update/settings/endpoint',
	'./user/update/privacy/endpoint',
	'./follow/create/endpoint'
];

export const loadEndpoints = () => {
	endpoints.forEach((file) => require(file));
};
