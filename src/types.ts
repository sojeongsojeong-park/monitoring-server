export interface Data {
	status: Status.ok;
	server_issue: string[] | null;
	data: (ServerData | FetchingError)[];
}

export interface FetchingError {
	status: Status.error;
	error: string;
}

export interface ServerData {
	status: Status;
	region: Region;
	roles: string[];
	results: {
		services: {
			redis: boolean;
			database: boolean;
		};
		stats: {
			servers_count: number;
			online: number;
			session: number;
			server: {
				cpus: number;
				active_connections: number;
				wait_time: number;
				workers: Workers[];
				cpu_load: number;
				timers: number;
			};
		};
	};
	strict: boolean;
	server_issue: string | null;
	version: string;
}

export enum Status {
	ok = 'ok',
	error = 'error',
}

type Region =
	| 'us-east'
	| 'eu-west'
	| 'eu-central'
	| 'us-west'
	| 'sa-east'
	| 'ap-southeast';

type Workers = Record<string, WorkerStats>;

interface WorkerStats {
	wait_time: number;
	workers: number;
	waiting: number;
	idle: number;
	time_to_return: number;
	recently_blocked_keys: BlockedKey[];
	top_keys: TopKey[];
}

type BlockedKey = [string, number, string];
type TopKey = [string, number];
