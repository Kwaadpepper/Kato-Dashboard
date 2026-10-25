import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { NormalizedIncident, NormalizedProbe } from '$lib/types';
import {
	anonymizeIncidents,
	anonymizeProbe,
	anonymizeProbeId,
	anonymizeProbes,
	isAnonymizeEnabled,
	setAnonymizeEnabled,
	toggleAnonymize
} from './anonymize.ts';

describe('anonymize utility module', () => {
	const sampleProbes: NormalizedProbe[] = [
		{
			id: 'kuma_prod:42',
			source: 'kuma_prod',
			name: 'Secret Internal Payroll ERP',
			url: 'https://payroll.secret-company.corp:8443/health',
			status: 'down',
			responseTime: null,
			uptime24h: 94.5,
			uptime7d: 99.1,
			lastCheck: '2026-10-25T10:00:00.000Z',
			group: 'Confidential Finance',
			criticality: 'critical'
		},
		{
			id: 'robot:99',
			source: 'uptimerobot',
			name: 'Client Portal VPN',
			url: 'https://vpn.client-domain.org',
			status: 'up',
			responseTime: 42,
			uptime24h: 100,
			uptime7d: 99.98,
			lastCheck: '2026-10-25T10:00:00.000Z',
			group: null,
			criticality: 'high'
		}
	];

	it('should return original probes when anonymization is disabled', () => {
		const res = anonymizeProbes(sampleProbes, false);
		assert.equal(res[0].name, 'Secret Internal Payroll ERP');
		assert.equal(res[0].url, 'https://payroll.secret-company.corp:8443/health');
	});

	it('should deterministically replace name, url, and group while preserving metrics and source when enabled', () => {
		const res = anonymizeProbes(sampleProbes, true);
		assert.equal(res.length, 2);

		// Name, URL, and Group are replaced
		assert.notEqual(res[0].name, 'Secret Internal Payroll ERP');
		assert.notEqual(res[0].url, 'https://payroll.secret-company.corp:8443/health');
		assert.notEqual(res[0].group, 'Confidential Finance');
		assert.equal(res[0].name, 'API Gateway Prod');

		// Status, latency, uptime, criticality, and source are strictly preserved
		assert.equal(res[0].id, 'kuma_prod:42');
		assert.equal(res[0].source, 'kuma_prod');
		assert.equal(res[0].status, 'down');
		assert.equal(res[0].uptime24h, 94.5);
		assert.equal(res[0].criticality, 'critical');

		// Null group stays null
		assert.equal(res[1].group, null);
		assert.equal(res[1].responseTime, 42);
	});

	it('should anonymize incident probeName and scrub sensitive hostnames/IPs from cause while keeping HTTP status codes', () => {
		const incidents: NormalizedIncident[] = [
			{
				id: 'inc:1',
				probeId: 'kuma_prod:42',
				probeName: 'Secret Internal Payroll ERP',
				type: 'down',
				startedAt: '2026-10-25T09:50:00.000Z',
				resolvedAt: null,
				duration: null,
				cause: 'getaddrinfo ENOTFOUND payroll.secret-company.corp (10.24.0.15:8443)'
			},
			{
				id: 'inc:2',
				probeId: 'kuma_prod:42',
				probeName: 'Secret Internal Payroll ERP',
				type: 'down',
				startedAt: '2026-10-25T08:00:00.000Z',
				resolvedAt: '2026-10-25T08:05:00.000Z',
				duration: 300,
				cause: 'HTTP 503 - Service Unavailable'
			}
		];

		const anonProbes = anonymizeProbes(sampleProbes, true);
		const anonIncidents = anonymizeIncidents(incidents, sampleProbes, true);

		assert.equal(anonIncidents[0].probeName, anonProbes[0].name);
		assert.notEqual(anonIncidents[0].probeName, 'Secret Internal Payroll ERP');
		assert.ok(!anonIncidents[0].cause?.includes('payroll.secret-company.corp'));
		assert.ok(!anonIncidents[0].cause?.includes('10.24.0.15'));
		assert.ok(anonIncidents[0].cause?.includes('api.acme-corp.internal'));

		// Standard technical cause without sensitive hostname is preserved intact
		assert.equal(anonIncidents[1].cause, 'HTTP 503 - Service Unavailable');
	});

	it('should scrub Uptime Kuma encoded monitor names from displayed probe IDs while preserving numeric IDs', () => {
		assert.equal(anonymizeProbeId('kuma_prod:42', 0, true), 'kuma_prod:42');
		assert.equal(anonymizeProbeId('mock:12', undefined, true), 'mock:12');
		const kumaEncoded = 'uk:Secret%20Internal%20Payroll%20ERP';
		const scrubbed = anonymizeProbeId(kumaEncoded, 0, true);
		assert.equal(scrubbed, 'uk:1');
		assert.ok(!scrubbed.includes('Secret'));
		assert.equal(anonymizeProbeId(kumaEncoded, 0, false), kumaEncoded);
	});

	it('should toggle state even when started with ?anonymize=1 in window.location.search', () => {
		const prevWindow = (globalThis as Record<string, unknown>).window;
		try {
			(globalThis as Record<string, unknown>).window = {
				location: { search: '?anonymize=1&tv=1' }
			};
			assert.equal(isAnonymizeEnabled(), true);

			// User clicks toggle in Settings -> should turn OFF despite ?anonymize=1 in URL
			const afterOff = toggleAnonymize();
			assert.equal(afterOff, false);
			assert.equal(isAnonymizeEnabled(), false);

			// User clicks toggle again -> should turn back ON
			const afterOn = toggleAnonymize();
			assert.equal(afterOn, true);
			assert.equal(isAnonymizeEnabled(), true);
		} finally {
			(globalThis as Record<string, unknown>).window = prevWindow;
			setAnonymizeEnabled(false);
		}
	});

	it('should generate unique suffixed names when probe count exceeds static blueprints', () => {
		const probe = anonymizeProbe(sampleProbes[0], 45);
		assert.ok(probe.name.includes('#'));
		assert.ok(probe.url.includes('.acme-corp.internal'));
	});
});
