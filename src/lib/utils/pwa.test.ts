import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

describe('PWA utility module', () => {
	let eventListeners: Record<string, EventListenerOrEventListenerObject[]> = {};
	let mediaQueries: Record<string, boolean> = {};

	beforeEach(() => {
		eventListeners = {};
		mediaQueries = {};

		const mockNavigator = {
			serviceWorker: {
				register: async () => ({})
			}
		};

		(globalThis as any).window = {
			addEventListener: (event: string, handler: EventListenerOrEventListenerObject) => {
				if (!eventListeners[event]) eventListeners[event] = [];
				eventListeners[event].push(handler);
			},
			matchMedia: (query: string) => ({
				matches: mediaQueries[query] ?? false,
				addEventListener: () => {},
				removeEventListener: () => {}
			}),
			navigator: mockNavigator
		};

		try {
			Object.defineProperty(globalThis, 'navigator', {
				value: mockNavigator,
				configurable: true,
				writable: true
			});
		} catch {}
	});

	it('should detect browser environment and standalone mode', async () => {
		const { isStandalone } = await import('./pwa.ts');
		assert.equal(isStandalone(), false);

		mediaQueries['(display-mode: standalone)'] = true;
		assert.equal(isStandalone(), true);
	});

	it('should handle deferred install prompt and installation choices', async () => {
		const { initPwa, canInstallPwa, promptPwaInstall, onPwaChange } = await import('./pwa.ts');
		initPwa();

		let promptCalled = false;
		const mockEvent = {
			preventDefault: () => {},
			prompt: async () => {
				promptCalled = true;
			},
			userChoice: Promise.resolve({ outcome: 'accepted', platform: 'web' })
		};

		// Trigger beforeinstallprompt event
		const beforeInstallHandlers = eventListeners['beforeinstallprompt'] || [];
		for (const h of beforeInstallHandlers) {
			if (typeof h === 'function') h(mockEvent as any);
		}

		assert.equal(canInstallPwa(), true);

		// Test subscriber notification
		let notifiedCanInstall = false;
		const unsub = onPwaChange((_installed, canInstall) => {
			notifiedCanInstall = canInstall;
		});

		assert.equal(notifiedCanInstall, true);

		// Prompt installation
		const outcome = await promptPwaInstall();
		assert.equal(outcome, true);
		assert.equal(promptCalled, true);
		assert.equal(canInstallPwa(), false);

		unsub();
	});

	it('should handle appinstalled event', async () => {
		const { initPwa, isPwaInstalled } = await import('./pwa.ts');
		initPwa();

		const appInstalledHandlers = eventListeners['appinstalled'] || [];
		for (const h of appInstalledHandlers) {
			if (typeof h === 'function') h({} as any);
		}

		assert.equal(isPwaInstalled(), true);
	});
});
