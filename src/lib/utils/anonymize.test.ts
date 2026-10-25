import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { NormalizedIncident, NormalizedProbe } from '$lib/types';
import {
	anonymizeIncidents,
	anonymizeProbe,
	anonymizeProbes,
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

	it('should anonymize incident probeName consistently with its probe', () => {
		const incidents: NormalizedIncident[] = [
			{
				id: 'inc:1',
				probeId: 'kuma_prod:42',
				probeName: 'Secret Internal Payroll ERP',
				type: 'down',
				startedAt: '2026-10-25T09:50:00.000Z',
				resolvedAt: null,
				duration: null
			}
		];

		const anonProbes = anonymizeProbes(sampleProbes, true);
		const anonIncidents = anonymizeIncidents(incidents, sampleProbes, true);

		assert.equal(anonIncidents[0].probeName, anonProbes[0].name);
		assert.notEqual(anonIncidents[0].probeName, 'Secret Internal Payroll ERP');
	});

	it('should toggle state and notify subscribers', () => {
		setAnonymizeEnabled(false);
		const next = toggleAnonymize();
		assert.equal(next, true);
		const back = toggleAnonymize();
		assert.equal(back, false);
	});

	it('should generate unique suffixed names when probe count exceeds static blueprints', () => {
		const probe = anonymizeProbe(sampleProbes[0], 45);
		assert.ok(probe.name.includes('#'));
		assert.ok(probe.url.includes('.acme-corp.internal'));
	});
});
