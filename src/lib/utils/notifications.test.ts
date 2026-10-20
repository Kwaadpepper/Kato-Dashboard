import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import type { NormalizedProbe } from '$lib/types';

describe('notifications utility module', () => {
	let mockStorage: Record<string, string> = {};
	let createdNotifications: any[] = [];
	let currentPermission: NotificationPermission = 'default';

	beforeEach(() => {
		mockStorage = {};
		createdNotifications = [];
		currentPermission = 'default';

		// Mock localStorage
		(globalThis as any).localStorage = {
			getItem: (key: string) => mockStorage[key] ?? null,
			setItem: (key: string, value: string) => {
				mockStorage[key] = value;
			},
			removeItem: (key: string) => {
				delete mockStorage[key];
			},
			clear: () => {
				mockStorage = {};
			}
		};

		// Mock Notification class
		class MockNotification {
			title: string;
			body: string;
			tag: string;
			icon: string;
			options: NotificationOptions;
			onclick: ((ev: Event) => any) | null = null;
			closed = false;

			static get permission() {
				return currentPermission;
			}

			static requestPermission = async (): Promise<NotificationPermission> => {
				return currentPermission;
			};

			constructor(title: string, options: NotificationOptions = {}) {
				this.title = title;
				this.options = options;
				this.body = options.body ?? '';
				this.tag = options.tag ?? '';
				this.icon = options.icon ?? '';
				createdNotifications.push(this);
			}

			close() {
				this.closed = true;
			}
		}

		(globalThis as any).Notification = MockNotification;
		(globalThis as any).window = globalThis;
	});

	it('should detect notification support and permission', async () => {
		const { isNotificationSupported, getNotificationPermission } = await import(
			'./notifications.ts'
		);
		assert.equal(isNotificationSupported(), true);
		assert.equal(getNotificationPermission(), 'default');

		currentPermission = 'granted';
		assert.equal(getNotificationPermission(), 'granted');
	});

	it('should default to false when localStorage is empty', async () => {
		const { isNotificationEnabled } = await import('./notifications.ts');
		assert.equal(isNotificationEnabled(), false);
		assert.equal(isNotificationEnabled(true), true);
	});

	it('should request permission and enable notifications when permission is granted', async () => {
		const { setNotificationEnabled, isNotificationEnabled } = await import(
			'./notifications.ts'
		);
		currentPermission = 'granted';

		const success = await setNotificationEnabled(true);
		assert.equal(success, true);
		assert.equal(isNotificationEnabled(), true);
		assert.equal(mockStorage['kato-notifications-enabled'], 'true');
	});

	it('should not enable notifications when permission is denied', async () => {
		const { setNotificationEnabled, isNotificationEnabled } = await import(
			'./notifications.ts'
		);
		currentPermission = 'denied';

		const success = await setNotificationEnabled(true);
		assert.equal(success, false);
		assert.equal(isNotificationEnabled(), false);
		assert.equal(mockStorage['kato-notifications-enabled'], 'false');
	});

	it('should toggle notifications correctly', async () => {
		const { toggleNotification, isNotificationEnabled } = await import('./notifications.ts');
		currentPermission = 'granted';

		// Toggle to enabled
		const t1 = await toggleNotification();
		assert.equal(t1, true);
		assert.equal(isNotificationEnabled(), true);

		// Toggle to disabled
		const t2 = await toggleNotification();
		assert.equal(t2, false);
		assert.equal(isNotificationEnabled(), false);
	});

	it('should notify subscribers on notification state changes', async () => {
		const { setNotificationEnabled, onNotificationChange } = await import(
			'./notifications.ts'
		);
		currentPermission = 'granted';

		const history: boolean[] = [];
		const unsub = onNotificationChange((enabled) => {
			history.push(enabled);
		});

		await setNotificationEnabled(true);
		await setNotificationEnabled(false);

		assert.ok(history.length >= 2);
		assert.equal(history[history.length - 1], false);

		unsub();
	});

	it('should emit probe status notification for DOWN status', async () => {
		const { setNotificationEnabled, emitProbeStatusNotification } = await import(
			'./notifications.ts'
		);
		currentPermission = 'granted';
		await setNotificationEnabled(true);

		const probe: NormalizedProbe = {
			id: 'p-1',
			source: 'mock',
			name: 'API Gateway',
			url: 'https://api.example.com',
			status: 'down',
			criticality: 'critical',
			responseTime: null,
			uptime24h: 99.1,
			uptime7d: 99.5,
			group: null,
			lastCheck: new Date().toISOString()
		};

		const notif = emitProbeStatusNotification(probe, 'up', 'down', { locale: 'fr' });
		assert.ok(notif);
		assert.equal(createdNotifications.length, 1);
		assert.equal(notif.title, '🔴 API Gateway est DOWN');
		assert.ok(notif.body.includes('UP ➔ DOWN'));
		assert.ok(notif.body.includes('https://api.example.com'));
		assert.equal(notif.tag, 'kato-probe-p-1');
		assert.equal(notif.icon, '/favicon.svg');
	});

	it('should emit probe status notification for UP recovery status', async () => {
		const { setNotificationEnabled, emitProbeStatusNotification } = await import(
			'./notifications.ts'
		);
		currentPermission = 'granted';
		await setNotificationEnabled(true);

		const probe: NormalizedProbe = {
			id: 'p-2',
			source: 'mock',
			name: 'Auth Service',
			url: 'https://auth.example.com',
			status: 'up',
			criticality: 'high',
			responseTime: 42,
			uptime24h: 99.9,
			uptime7d: 99.8,
			group: null,
			lastCheck: new Date().toISOString()
		};

		const notif = emitProbeStatusNotification(probe, 'down', 'up', { locale: 'en' });
		assert.ok(notif);
		assert.equal(notif.title, '🟢 Auth Service is restored (UP)');
		assert.ok(notif.body.includes('DOWN ➔ UP'));
		assert.ok(notif.body.includes('42ms'));
	});

	it('should emit probe status notification for DEGRADED status', async () => {
		const { setNotificationEnabled, emitProbeStatusNotification } = await import(
			'./notifications.ts'
		);
		currentPermission = 'granted';
		await setNotificationEnabled(true);

		const probe: NormalizedProbe = {
			id: 'p-3',
			source: 'mock',
			name: 'Database Primary',
			url: 'postgres://db.example.internal:5432',
			status: 'degraded',
			criticality: 'critical',
			responseTime: 1250,
			uptime24h: 98.5,
			uptime7d: 99.0,
			group: null,
			lastCheck: new Date().toISOString()
		};

		const notif = emitProbeStatusNotification(probe, 'up', 'degraded', { locale: 'fr' });
		assert.ok(notif);
		assert.equal(notif.title, '🟡 Database Primary est dégradé');
	});

	it('should emit consolidated notification for multiple simultaneous status changes', async () => {
		const { setNotificationEnabled, emitMultipleStatusChangesNotification } = await import(
			'./notifications.ts'
		);
		currentPermission = 'granted';
		await setNotificationEnabled(true);

		const notifFr = emitMultipleStatusChangesNotification(5, { locale: 'fr' });
		assert.ok(notifFr);
		assert.equal(notifFr.title, '⚠️ 5 sondes ont changé d’état');
		assert.equal(notifFr.tag, 'kato-mass-change');

		const notifEn = emitMultipleStatusChangesNotification(4, { locale: 'en' });
		assert.ok(notifEn);
		assert.equal(notifEn.title, '⚠️ 4 probes changed state');
	});

	it('should trigger click callback and focus window when clicked', async () => {
		const { setNotificationEnabled, emitProbeStatusNotification } = await import(
			'./notifications.ts'
		);
		currentPermission = 'granted';
		await setNotificationEnabled(true);

		let clicked = false;
		const probe: NormalizedProbe = {
			id: 'p-click',
			source: 'mock',
			name: 'Click Test',
			url: 'https://test.example.com',
			status: 'down',
			criticality: 'low',
			responseTime: null,
			uptime24h: 99,
			uptime7d: 99,
			group: null,
			lastCheck: new Date().toISOString()
		};

		const notif = emitProbeStatusNotification(probe, 'up', 'down', {
			onClick: () => {
				clicked = true;
			}
		});

		assert.ok(notif);
		assert.equal(clicked, false);

		notif.onclick?.({} as Event);
		assert.equal(clicked, true);
		assert.equal((notif as any).closed, true);
	});

	it('should not emit notification if sound/notifications are disabled', async () => {
		const { setNotificationEnabled, emitProbeStatusNotification } = await import(
			'./notifications.ts'
		);
		await setNotificationEnabled(false);

		const probe: NormalizedProbe = {
			id: 'p-disabled',
			source: 'mock',
			name: 'Disabled Test',
			url: 'https://test.example.com',
			status: 'down',
			criticality: 'low',
			responseTime: null,
			uptime24h: 99,
			uptime7d: 99,
			group: null,
			lastCheck: new Date().toISOString()
		};

		const notif = emitProbeStatusNotification(probe, 'up', 'down');
		assert.equal(notif, null);
	});
});
