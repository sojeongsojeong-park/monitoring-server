import { createServer } from 'http';
import WebSocket from 'ws';
import dotenv from 'dotenv';
dotenv.config();

import { startPolling } from './poller';
import { Data, FetchingError, Status } from './types';

const port = process.env.PORT || 4000;

const server = createServer();
const wss = new WebSocket.Server({ server });

let prevData: Data | null = null;

const isDataChanged = (prev: Data | null, next: Data) => {
	if (!prev) return true;
	prevData = next;
	return JSON.stringify(prev) !== JSON.stringify(next);
};

const broadcast = (payload: Data | FetchingError) => {
	const message = JSON.stringify(payload);
	wss.clients.forEach((client) => {
		if (client.readyState === WebSocket.OPEN) {
			client.send(message);
		}
	});
};

wss.on('connection', (ws) => {
	console.log('Client connected ✅');
});

startPolling((data) => {
	if (!data || data.status === Status.error) {
		broadcast({
			status: Status.error,
			data: data?.data || 'Unknown error',
		});
		return;
	}

	if (isDataChanged(prevData, data)) {
		broadcast({ ...data, update_at: new Date().toISOString() });
	}
});

server.listen(port, () => {
	console.log(`🚀 Server running`);
});
