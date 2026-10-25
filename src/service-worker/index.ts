/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import { self } from '$app/service-worker';
import { version } from '$app/env';
import { immutable, assets } from '$app/manifest';
import { resolve } from '$app/paths';

const sw = self;
const CACHE_NAME = `kato-cache-v${version}`;

// Resolve manifest assets to absolute pathnames
const PRECACHE_ASSETS = [
	...immutable.map((asset) => resolve(asset.path)),
	...assets.map((asset) => resolve(asset.path))
];

sw.addEventListener('install', (event: ExtendableEvent) => {
	event.waitUntil(
		(async () => {
			const cache = await caches.open(CACHE_NAME);
			await cache.addAll(PRECACHE_ASSETS);
			await sw.skipWaiting();
		})()
	);
});

sw.addEventListener('activate', (event: ExtendableEvent) => {
	event.waitUntil(
		(async () => {
			const keys = await caches.keys();
			await Promise.all(
				keys.map((key) => {
					if (key !== CACHE_NAME) {
						return caches.delete(key);
					}
				})
			);
			await sw.clients.claim();
		})()
	);
});

sw.addEventListener('fetch', (event: FetchEvent) => {
	// Only handle GET requests
	if (event.request.method !== 'GET') return;

	const url = new URL(event.request.url);

	// Never intercept Server-Sent Events (/api/events) or API endpoints
	if (url.pathname.startsWith('/api/')) {
		return;
	}

	event.respondWith(
		(async () => {
			const cache = await caches.open(CACHE_NAME);

			// 1. Immutable / static assets: Cache first
			if (PRECACHE_ASSETS.includes(url.pathname)) {
				const cached = await cache.match(event.request);
				if (cached) return cached;
			}

			// 2. Navigation and dynamic assets: Network first with Cache fallback
			try {
				const response = await fetch(event.request);
				if (response.status === 200) {
					void cache.put(event.request, response.clone());
				}
				return response;
			} catch {
				const cached = await cache.match(event.request);
				if (cached) return cached;

				// Offline fallback to root page shell
				if (event.request.mode === 'navigate') {
					const rootCached = await cache.match('/');
					if (rootCached) return rootCached;
				}

				return new Response('Network error (offline)', {
					status: 503,
					statusText: 'Service Unavailable',
					headers: { 'Content-Type': 'text/plain' }
				});
			}
		})()
	);
});
