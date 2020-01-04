
const endpoints: string[] = [
	'./healthcheck/endpoint',
	'./user/search/endpoint'
];

export const loadEndpoints = () => {
	endpoints.forEach((file) => require(file));
};
