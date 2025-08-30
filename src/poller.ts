import axios from 'axios';
import { Data, FetchingError, ServerData, Status } from './types';

const usEastEndpoint = process.env.US_EAST_ENDPOINT || '';
const usWestEndpoint = process.env.US_WEST_ENDPOINT || '';
const euWestEndpoint = process.env.EU_WEST_ENDPOINT || '';
const euCentralEndpoint = process.env.EU_CENTRAL_ENDPOINT || '';
const saEastEndpoint = process.env.SA_EAST_ENDPOINT || '';
const apSouthEastEndpoint = process.env.AP_SOUTHEAST_ENDPOINT || '';

const endpoints = [
	usEastEndpoint,
	usWestEndpoint,
	euWestEndpoint,
	euCentralEndpoint,
	saEastEndpoint,
	apSouthEastEndpoint,
];

const interval = Number(process.env.POLL_INTERVAL) || 300000;

const fetchingDatas = async (
	endpoint: string
): Promise<ServerData | FetchingError> => {
	try {
		const res = await axios.get(endpoint, { timeout: 3000 });
		return res.data;
	} catch (err: any) {
		return { status: Status.error, error: err.message };
	}
};

const isServerData = (res: ServerData | FetchingError): res is ServerData => {
	return res.status === Status.ok && res.server_issue !== null;
};

export function startPolling(callback: (data: Data | FetchingError) => void) {
	setInterval(async () => {
		try {
			const promises = endpoints.map((endpoint) => fetchingDatas(endpoint));
			const results = await Promise.all(promises);

			const serverIssues = results
				.filter(isServerData)
				.flatMap((res) => res.server_issue ?? []);

			const serverIssue: string[] | null =
				serverIssues.length > 0 ? serverIssues : null;

			callback({
				status: Status.ok,
				server_issue: serverIssue,
				data: results,
			});
		} catch (err: any) {
			callback({ status: Status.error, error: err.message });
		}
	}, interval);
}
