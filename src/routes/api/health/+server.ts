import { store } from '#lib/server/store';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

/**
 * Lightweight health check endpoint for container orchestrators (Docker HEALTHCHECK, Kubernetes, Reverse Proxies).
 */
export const GET: RequestHandler = () => {
	const state = store.getState();
	return json({
		status: 'ok',
		probes: state.probes.length,
		source: state.source,
		lastUpdate: state.lastUpdate,
		timestamp: new Date().toISOString()
	});
};
