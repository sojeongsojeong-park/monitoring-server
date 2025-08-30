import axios from 'axios';
import { Data } from './types';

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
): Promise<Data | { status: 'error'; error: string }> => {
	try {
		const res = await axios.get(endpoint, { timeout: 3000 });
		return res.data;
	} catch (err: any) {
		return { status: 'error', error: err.message };
	}
};

export function startPolling(callback: (data: any) => void) {
	setInterval(async () => {
		try {
			const promises = endpoints.map((endpoint) => fetchingDatas(endpoint));
			const results = await Promise.all(promises);

			const serverIssue = results.filter(
				(res) => res.status === 'ok' && res.server_issue != null
			);

			callback({
				status: 'ok',
				server_issue: serverIssue,
				data: results,
			});
		} catch (err: any) {
			callback({ status: 'error', error: err.message });
		}
	}, interval);
}
