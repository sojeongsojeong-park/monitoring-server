import { createServer } from 'http';
import WebSocket from 'ws';
import dotenv from 'dotenv';
dotenv.config();

import { startPolling } from './poller';

const port = process.env.PORT || 4000;

const server = createServer();
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
	console.log('Client connected ✅');

	ws.send(JSON.stringify({ message: 'Connected to server' }));
});

startPolling((data) => {
	wss.clients.forEach((client) => {
		if (client.readyState === WebSocket.OPEN) {
			client.send(JSON.stringify(data));
		}
	});
});

server.listen(port, () => {
	console.log(`🚀 Server running on http://localhost:${port}`);
});
