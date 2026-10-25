import type { NormalizedIncident, NormalizedProbe } from '$lib/types';

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
 * Supports `?anonymize=1` URL parameter or `localStorage` persistence.
 */
export function isAnonymizeEnabled(): boolean {
	if (typeof window === 'undefined') return anonymizeState;

	try {
		const params = new URLSearchParams(window.location.search);
		const urlFlag = params.get('anonymize');
		if (urlFlag === '1' || urlFlag === 'true') {
			anonymizeState = true;
			return true;
		}
		if (urlFlag === '0' || urlFlag === 'false') {
			anonymizeState = false;
			return false;
		}
	} catch {
		// Ignore URL parsing errors
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
	if (typeof window !== 'undefined') {
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
 * Maps incident `probeName` to match the corresponding anonymized probe name.
 */
export function anonymizeIncidents(
	incidents: NormalizedIncident[],
	probes: NormalizedProbe[] = [],
	enabled: boolean = isAnonymizeEnabled()
): NormalizedIncident[] {
	if (!enabled) return incidents;

	const indexById = new Map<string, number>();
	for (let i = 0; i < probes.length; i++) {
		indexById.set(probes[i].id, i);
	}

	return incidents.map((inc) => {
		const idx = indexById.get(inc.probeId);
		const blueprint = getAnonymousBlueprint(inc.probeId, idx);
		return {
			...inc,
			probeName: blueprint.name
		};
	});
}
