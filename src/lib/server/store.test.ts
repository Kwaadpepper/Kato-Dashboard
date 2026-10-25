import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { store } from './store.ts';
import type { NormalizedProbe } from '$lib/types';

describe('DashboardStore lifecycle and memory leak prevention', () => {
	it('should cleanly register and deregister subscribers without leaks', () => {
		const initialCount = store.getSubscriberCount();

		const unsub1 = store.subscribe(() => {});
		const unsub2 = store.subscribe(() => {});

		assert.equal(store.getSubscriberCount(), initialCount + 2);

		unsub1();
		assert.equal(store.getSubscriberCount(), initialCount + 1);

		unsub2();
		assert.equal(store.getSubscriberCount(), initialCount);
	});

	it('should dispatch updates to subscribers when probes change status', () => {
		const receivedDeltas: unknown[] = [];
		const unsub = store.subscribe((delta) => {
			receivedDeltas.push(delta);
		});

		const probe1: NormalizedProbe = {
			id: 'test-probe-1',
			name: 'Test Probe 1',
			url: 'https://test.kato.io',
			status: 'up',
			responseTime: 50,
			uptime24h: 100,
			uptime7d: 100,
			criticality: 'critical',
			lastCheck: new Date().toISOString(),
			group: 'APIs',
			source: 'test'
		};

		// Initial update
		store.updateProbes([probe1], 'test');

		// Transition to down
		const downProbe: NormalizedProbe = {
			...probe1,
			status: 'down',
			downSince: new Date().toISOString()
		};

		store.updateProbes([downProbe], 'test');

		assert.ok(receivedDeltas.length >= 1, 'Expected at least one delta dispatched');

		unsub();
	});

	it('should not crash or drop other subscribers if one subscriber throws an error', () => {
		let secondReceived = false;

		const unsubBad = store.subscribe(() => {
			throw new Error('Failing subscriber');
		});

		const unsubGood = store.subscribe(() => {
			secondReceived = true;
		});

		const probe: NormalizedProbe = {
			id: 'test-probe-2',
			name: 'Test Probe 2',
			url: 'https://test2.kato.io',
			status: 'down',
			responseTime: null,
			uptime24h: 90,
			uptime7d: 90,
			criticality: 'high',
			lastCheck: new Date().toISOString(),
			group: 'APIs',
			source: 'test'
		};

		store.updateProbes([probe], 'test');

		assert.equal(secondReceived, true, 'Healthy subscriber should still receive the update');

		unsubBad();
		unsubGood();
	});

	it('should aggregate probes from multiple sources and retrieve them via getProbe', () => {
		store.reset();

		const probeA: NormalizedProbe = {
			id: 'kuma_prod:1',
			name: 'Prod API',
			url: 'https://api.prod.lan',
			status: 'up',
			responseTime: 45,
			uptime24h: 100,
			uptime7d: 100,
			lastCheck: new Date().toISOString(),
			criticality: 'critical',
			group: 'APIs',
			source: 'kuma_prod'
		};

		const probeB: NormalizedProbe = {
			id: 'kuma_lan:1',
			name: 'Lab API',
			url: 'https://lab.internal',
			status: 'down',
			responseTime: null,
			uptime24h: 98,
			uptime7d: 99,
			lastCheck: new Date().toISOString(),
			criticality: 'low',
			group: 'Infrastructure',
			source: 'kuma_lan'
		};

		store.updateProbes([probeA], 'kuma_prod');
		store.updateProbes([probeB], 'kuma_lan');

		assert.equal(store.getProbe('kuma_prod:1')?.name, 'Prod API');
		assert.equal(store.getProbe('kuma_lan:1')?.name, 'Lab API');
		assert.equal(store.getProbe('nonexistent'), undefined);

		const state = store.getState();
		assert.equal(state.probes.length, 2);
		assert.equal(state.source.includes('kuma_prod'), true);
		assert.equal(state.source.includes('kuma_lan'), true);
	});

	it('should detect deleted probes for a source, emit removedProbeIds, and purge incidents', () => {
		store.reset();

		const probe1: NormalizedProbe = {
			id: 'uk:1',
			name: 'Monitor 1',
			url: 'https://mon1.lan',
			status: 'down',
			responseTime: null,
			uptime24h: 95,
			uptime7d: 95,
			lastCheck: new Date().toISOString(),
			criticality: 'medium',
			group: null,
			source: 'UptimeKuma'
		};

		const probe2: NormalizedProbe = {
			id: 'uk:2',
			name: 'Monitor 2',
			url: 'https://mon2.lan',
			status: 'up',
			responseTime: 30,
			uptime24h: 100,
			uptime7d: 100,
			lastCheck: new Date().toISOString(),
			criticality: 'medium',
			group: null,
			source: 'UptimeKuma'
		};

		const probeOtherSource: NormalizedProbe = {
			id: 'ur:1',
			name: 'Robot Monitor',
			url: 'https://robot.lan',
			status: 'up',
			responseTime: 20,
			uptime24h: 100,
			uptime7d: 100,
			lastCheck: new Date().toISOString(),
			criticality: 'medium',
			group: null,
			source: 'UptimeRobot'
		};

		// Initial load with 2 UptimeKuma probes and 1 UptimeRobot probe
		store.updateProbes([probe1, probe2], 'UptimeKuma');
		store.updateProbes([probeOtherSource], 'UptimeRobot');

		assert.equal(store.getState().probes.length, 3);
		// probe1 started DOWN so an incident was created
		assert.equal(store.getState().incidents.length, 1);
		assert.equal(store.getState().incidents[0].probeId, 'uk:1');

		// Next poll for UptimeKuma: monitor 1 was deleted in UptimeKuma!
		const delta = store.updateProbes([probe2], 'UptimeKuma');

		assert.ok(delta !== null, 'Delta must be produced for probe deletion');
		assert.deepEqual(delta.removedProbeIds, ['uk:1']);
		assert.ok(delta.resolvedIncidentIds.length >= 1, 'Active incident must be resolved/cleared');

		// Store must no longer contain uk:1, but must still have uk:2 and ur:1
		const updatedState = store.getState();
		assert.equal(updatedState.probes.length, 2);
		assert.equal(store.getProbe('uk:1'), undefined);
		assert.equal(store.getProbe('uk:2')?.name, 'Monitor 2');
		assert.equal(store.getProbe('ur:1')?.name, 'Robot Monitor');

		// Incidents of deleted probe must be purged
		assert.equal(updatedState.incidents.length, 0);
	});
});


