import type { NormalizedIncident, NormalizedProbe } from '#lib/types';

export const ANONYMIZE_STORAGE_KEY = 'kato-anonymize-enabled';

interface AnonymousBlueprint {
	name: string;
	group: string;
	url: string;
}

const ANONYMOUS_BLUEPRINTS: readonly AnonymousBlueprint[] = [
	{ name: 'API Gateway Prod', group: 'APIs', url: 'https://api.acme-corp.internal/v1' },
	{ name: 'Auth OAuth2 Service', group: 'APIs', url: 'https://auth.acme-corp.internal/oauth' },
	{ name: 'Billing & Payments API', group: 'APIs', url: 'https://billing.acme-corp.internal' },
	{ name: 'User Directory API', group: 'APIs', url: 'https://users.acme-corp.internal/api' },
	{ name: 'Notification Dispatcher', group: 'APIs', url: 'https://notify.acme-corp.internal' },
	{ name: 'Elasticsearch Cluster', group: 'Infrastructure', url: 'https://search.acme-corp.internal/_cluster' },
	{ name: 'Webhook Relay Engine', group: 'APIs', url: 'https://webhooks.acme-corp.internal' },
	{ name: 'GraphQL Edge Federation', group: 'APIs', url: 'https://graphql.acme-corp.internal' },
	{ name: 'PostgreSQL Primary', group: 'Infrastructure', url: 'postgresql://pg-primary.internal:5432' },
	{ name: 'PostgreSQL Read Replica', group: 'Infrastructure', url: 'postgresql://pg-replica.internal:5432' },
	{ name: 'Redis Cache Cluster', group: 'Infrastructure', url: 'redis://redis-cluster.internal:6379' },
	{ name: 'RabbitMQ Broker', group: 'Infrastructure', url: 'amqp://mq-broker.internal:5672' },
	{ name: 'Kafka Event Stream', group: 'Infrastructure', url: 'kafka://kafka-01.internal:9092' },
	{ name: 'Kubernetes Ingress LB', group: 'Infrastructure', url: 'https://k8s-ingress.internal/healthz' },
	{ name: 'S3 Object Storage', group: 'Infrastructure', url: 'https://s3.eu-west-1.acme-storage.io' },
	{ name: 'Core DNS Anycast', group: 'Infrastructure', url: 'dns://ns1.acme-dns.net' },
	{ name: 'Customer Web Portal', group: 'Websites', url: 'https://app.acme-corp.io' },
	{ name: 'Marketing Website', group: 'Websites', url: 'https://www.acme-corp.io' },
	{ name: 'Documentation Hub', group: 'Websites', url: 'https://docs.acme-corp.io' },
	{ name: 'Public Status Page', group: 'Websites', url: 'https://status.acme-corp.io' },
	{ name: 'Admin Backoffice', group: 'Websites', url: 'https://admin.acme-corp.internal' },
	{ name: 'Developer Console', group: 'Websites', url: 'https://developers.acme-corp.io' },
	{ name: 'Worker Analytics Pipeline', group: 'Production', url: 'https://workers.acme-corp.internal/analytics' },
	{ name: 'Worker Log Ingestion', group: 'Production', url: 'https://workers.acme-corp.internal/logs' },
	{ name: 'Worker Ledger Sync', group: 'Production', url: 'https://workers.acme-corp.internal/sync' },
	{ name: 'SMTP Transactional Mailer', group: 'Production', url: 'https://mailer.acme-corp.internal/health' },
	{ name: 'CDN Edge Paris', group: 'Production', url: 'https://edge-par.acme-cdn.net/ping' },
	{ name: 'CDN Edge Frankfurt', group: 'Production', url: 'https://edge-fra.acme-cdn.net/ping' },
	{ name: 'CDN Edge New York', group: 'Production', url: 'https://edge-nyc.acme-cdn.net/ping' },
	{ name: 'Backup Vault Engine', group: 'Production', url: 'https://backup.acme-corp.internal/status' },
	{ name: 'Staging API Gateway', group: 'Staging', url: 'https://api-staging.acme-corp.dev' },
	{ name: 'Staging Web App', group: 'Staging', url: 'https://staging.acme-corp.dev' }
] as const;

type AnonymizeListener = (enabled: boolean) => void;
const listeners = new Set<AnonymizeListener>();
let anonymizeState = false;
let hasExplicitOverride = false;
let lastSeenSearch: string | null = null;

/**
 * Deterministic string hash -> non-negative integer.
 */
function hashId(value: string): number {
	let hash = 0;
	for (let i = 0; i < value.length; i++) {
		hash = (hash << 5) - hash + value.charCodeAt(i);
		hash |= 0;
	}
	return Math.abs(hash);
}

/**
 * Resolves a deterministic anonymous blueprint for a given probe ID and optional index.
 */
export function getAnonymousBlueprint(probeId: string, index?: number): AnonymousBlueprint {
	const idx =
		typeof index === 'number' && index >= 0
			? index
			: hashId(probeId || 'probe');

	if (idx < ANONYMOUS_BLUEPRINTS.length) {
		return ANONYMOUS_BLUEPRINTS[idx];
	}

	const base = ANONYMOUS_BLUEPRINTS[idx % ANONYMOUS_BLUEPRINTS.length];
	const nodeNum = Math.floor(idx / ANONYMOUS_BLUEPRINTS.length) + 1;
	const slug = `${base.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${nodeNum}`;
	return {
		name: `${base.name} #${nodeNum}`,
		group: base.group,
		url: `https://${slug}.acme-corp.internal`
	};
}

/**
 * Checks whether privacy / screenshot anonymization mode is active.
 * Supports `?anonymize=1` URL parameter or `localStorage` persistence,
 * while allowing interactive toggling via `setAnonymizeEnabled` / `toggleAnonymize`.
 */
export function isAnonymizeEnabled(): boolean {
	if (typeof window === 'undefined') return anonymizeState;

	try {
		const currentSearch = window.location?.search ?? '';
		if (currentSearch !== lastSeenSearch) {
			lastSeenSearch = currentSearch;
			const params = new URLSearchParams(currentSearch);
			const urlFlag = params.get('anonymize');
			if (urlFlag === '1' || urlFlag === 'true') {
				anonymizeState = true;
				hasExplicitOverride = true;
				return true;
			}
			if (urlFlag === '0' || urlFlag === 'false') {
				anonymizeState = false;
				hasExplicitOverride = true;
				return false;
			}
		}
	} catch {
		// Ignore URL parsing errors
	}

	if (hasExplicitOverride) {
		return anonymizeState;
	}

	try {
		const saved = localStorage.getItem(ANONYMIZE_STORAGE_KEY);
		if (saved !== null) {
			anonymizeState = saved === 'true';
			return anonymizeState;
		}
	} catch {
		// Ignore localStorage access errors
	}

	return anonymizeState;
}

/**
 * Enables or disables anonymization mode and notifies subscribers.
 */
export function setAnonymizeEnabled(enabled: boolean): void {
	anonymizeState = enabled;
	hasExplicitOverride = true;

	if (typeof window !== 'undefined') {
		try {
			lastSeenSearch = window.location?.search ?? '';
		} catch {
			// Ignore location access errors
		}
		try {
			localStorage.setItem(ANONYMIZE_STORAGE_KEY, String(enabled));
		} catch {
			// Ignore storage errors
		}
	}

	for (const listener of listeners) {
		try {
			listener(enabled);
		} catch (err) {
			console.error('[Anonymize] Error in listener:', err);
		}
	}
}

/**
 * Toggles anonymization mode and returns the new state.
 */
export function toggleAnonymize(): boolean {
	const next = !isAnonymizeEnabled();
	setAnonymizeEnabled(next);
	return next;
}

/**
 * Subscribes to anonymization state changes.
 */
export function onAnonymizeChange(listener: AnonymizeListener): () => void {
	listeners.add(listener);
	listener(isAnonymizeEnabled());
	return () => {
		listeners.delete(listener);
	};
}

/**
 * Formats a probe ID for safe display in Privacy Mode.
 * Preserves numeric suffixes (e.g. `mock:12`, `kuma_prod:42`) while replacing
 * encoded monitor names (such as Uptime Kuma's `uk:Secret%20Internal%20Service`)
 * with a deterministic numeric identifier.
 */
export function anonymizeProbeId(
	probeId: string,
	index?: number,
	enabled: boolean = isAnonymizeEnabled()
): string {
	if (!enabled || !probeId) return probeId;
	const colonIdx = probeId.indexOf(':');
	if (colonIdx === -1) {
		return /^\d+$/.test(probeId)
			? probeId
			: `probe:${typeof index === 'number' && index >= 0 ? index + 1 : (hashId(probeId) % 900) + 100}`;
	}
	const prefix = probeId.slice(0, colonIdx);
	const suffix = probeId.slice(colonIdx + 1);
	if (/^\d+$/.test(suffix)) {
		return probeId;
	}
	const anonNum =
		typeof index === 'number' && index >= 0 ? index + 1 : (hashId(probeId) % 900) + 100;
	return `${prefix}:${anonNum}`;
}

/**
 * Scrubs sensitive URLs, IPv4 addresses, hostnames, or raw probe names from an incident cause
 * while keeping HTTP status codes and technical error descriptions intact.
 */
export function anonymizeIncidentCause(
	cause: string | undefined,
	blueprint: AnonymousBlueprint,
	rawProbe?: Pick<NormalizedProbe, 'name' | 'url'>
): string | undefined {
	if (!cause) return cause;
	let scrubbed = cause;

	let anonHost = 'service.acme-corp.internal';
	try {
		anonHost = new URL(blueprint.url).host || anonHost;
	} catch {
		// Fallback host
	}

	if (rawProbe?.url) {
		scrubbed = scrubbed.split(rawProbe.url).join(blueprint.url);
		try {
			const rawHost = new URL(rawProbe.url).hostname;
			if (rawHost) {
				scrubbed = scrubbed.split(rawHost).join(anonHost);
			}
		} catch {
			// Ignore invalid URL
		}
	}
	if (rawProbe?.name && rawProbe.name.length >= 3) {
		scrubbed = scrubbed.split(rawProbe.name).join(blueprint.name);
	}

	// Scrub embedded URLs
	scrubbed = scrubbed.replace(/[a-zA-Z][a-zA-Z0-9+.-]*:\/\/[^\s)]+/g, blueprint.url);
	// Scrub IPv4 addresses (with optional port)
	scrubbed = scrubbed.replace(/\b\d{1,3}(?:\.\d{1,3}){3}(?::\d+)?\b/g, anonHost);
	// Scrub FQDNs / internal hostnames (e.g. db.secret.corp or node-1.lan:5432)
	scrubbed = scrubbed.replace(
		/\b[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+(?::\d+)?\b/g,
		(match) => {
			// Preserve decimal numbers like "99.95"
			if (/^\d+\.\d+$/.test(match)) return match;
			return anonHost;
		}
	);

	return scrubbed;
}

/**
 * Returns an anonymized copy of a probe (replacing name, url, and group deterministically)
 * while preserving real status, latency, uptime, criticality, and source badge.
 */
export function anonymizeProbe(probe: NormalizedProbe, index?: number): NormalizedProbe {
	const blueprint = getAnonymousBlueprint(probe.id, index);
	return {
		...probe,
		name: blueprint.name,
		url: blueprint.url,
		group: probe.group ? blueprint.group : null
	};
}

/**
 * Returns an anonymized list of probes when `enabled` is true.
 */
export function anonymizeProbes(
	probes: NormalizedProbe[],
	enabled: boolean = isAnonymizeEnabled()
): NormalizedProbe[] {
	if (!enabled) return probes;
	return probes.map((probe, idx) => anonymizeProbe(probe, idx));
}

/**
 * Returns an anonymized list of incidents when `enabled` is true.
 * Maps incident `probeName` and `cause` to match the corresponding anonymized probe.
 */
export function anonymizeIncidents(
	incidents: NormalizedIncident[],
	probes: NormalizedProbe[] = [],
	enabled: boolean = isAnonymizeEnabled()
): NormalizedIncident[] {
	if (!enabled) return incidents;

	const indexById = new Map<string, number>();
	const probeById = new Map<string, NormalizedProbe>();
	for (let i = 0; i < probes.length; i++) {
		indexById.set(probes[i].id, i);
		probeById.set(probes[i].id, probes[i]);
	}

	return incidents.map((inc) => {
		const idx = indexById.get(inc.probeId);
		const rawProbe = probeById.get(inc.probeId);
		const blueprint = getAnonymousBlueprint(inc.probeId, idx);
		const scrubbedCause = anonymizeIncidentCause(inc.cause, blueprint, rawProbe);
		return {
			...inc,
			probeName: blueprint.name,
			...(scrubbedCause !== undefined ? { cause: scrubbedCause } : {})
		};
	});
}
