import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { MockAdapter } from './mock.adapter.ts';

describe('MockAdapter multi-source demo mode', () => {
	it('should assign realistic multi-sources (kuma-prod, kuma-lan, uptimerobot) when name is default "mock"', async () => {
		const adapter = new MockAdapter('mock');
		await adapter.initialize({ count: 12 });
		const probes = await adapter.fetchProbes();

		assert.equal(probes.length, 12);
		const sources = new Set(probes.map((p) => p.source));
		assert.deepEqual(Array.from(sources), ['kuma-prod', 'kuma-lan', 'uptimerobot']);
		assert.equal(probes[0].id, 'mock:1');
		assert.equal(probes[0].source, 'kuma-prod');
		assert.equal(probes[1].source, 'kuma-lan');
		assert.equal(probes[2].source, 'uptimerobot');
	});

	it('should preserve custom instance name as source when named explicitly', async () => {
		const adapter = new MockAdapter('demo_staging');
		await adapter.initialize({ count: 6 });
		const probes = await adapter.fetchProbes();

		assert.equal(probes.length, 6);
		for (const p of probes) {
			assert.equal(p.source, 'demo_staging');
			assert.ok(p.id.startsWith('demo_staging:'));
		}
	});
});
