
const endpoints: string[] = [
	'./healthcheck/endpoint',
];

export const loadEndpoints = () => {
	endpoints.forEach((file) => require(file));
};
