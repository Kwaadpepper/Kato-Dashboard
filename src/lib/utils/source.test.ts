import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { getSourceBadge, getSourceInitials } from './source.ts';

describe('source utility module', () => {
	it('should compute appropriate 2-4 letter initials for various provider names', () => {
		assert.equal(getSourceInitials('Uptime Kuma'), 'UK');
		assert.equal(getSourceInitials('UptimeRobot'), 'UR');
		assert.equal(getSourceInitials('Uptime-Robot'), 'UR');
		assert.equal(getSourceInitials('kuma_prod'), 'KP');
		assert.equal(getSourceInitials('UptimeKuma (prod)'), 'UKP');
		assert.equal(getSourceInitials('UptimeKuma (paris-1)'), 'UKP1');
		assert.equal(getSourceInitials('mock'), 'MOCK');
		assert.equal(getSourceInitials('prometheus'), 'PRO');
		assert.equal(getSourceInitials(''), 'SRC');
	});

	it('should return deterministic badge and styling for the same source name', () => {
		const badge1 = getSourceBadge('UptimeKuma (Production)');
		const badge2 = getSourceBadge('UptimeKuma (Production)');

		assert.equal(badge1.initials, 'UKP');
		assert.equal(badge1.source, 'UptimeKuma (Production)');
		assert.equal(badge1.className, badge2.className);
		assert.ok(badge1.className.includes('border-'));
		assert.ok(badge1.className.includes('bg-'));
	});

	it('should fallback gracefully when source is empty or null', () => {
		const badgeNull = getSourceBadge(null);
		assert.equal(badgeNull.source, 'Default');
		assert.equal(badgeNull.initials, 'DEF');

		const badgeEmpty = getSourceBadge('');
		assert.equal(badgeEmpty.source, 'Default');
		assert.equal(badgeEmpty.initials, 'DEF');
	});
});
