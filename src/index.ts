import { createServer } from 'http';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 4000;

const server = createServer();

server.listen(port, () => {
	console.log(`🚀 Server running on http://localhost:${port}`);
});
