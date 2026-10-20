/**
 * Progressive Web App (PWA) installation and display mode utility module.
 * Captures `beforeinstallprompt` event and detects standalone display mode.
 */

export interface BeforeInstallPromptEvent extends Event {
	readonly platforms: string[];
	readonly userChoice: Promise<{
		outcome: 'accepted' | 'dismissed';
		platform: string;
	}>;
	prompt(): Promise<void>;
}

export type PwaListener = (installed: boolean, canInstall: boolean) => void;

let deferredPrompt: BeforeInstallPromptEvent | null = null;
let isInstalledState = false;
const listeners = new Set<PwaListener>();
let isInitialized = false;

/**
 * Checks whether the app is currently running in standalone (PWA) mode.
 */
export function isStandalone(): boolean {
	if (typeof window === 'undefined') return false;

	const isDisplayStandalone = window.matchMedia('(display-mode: standalone)').matches;
	const isIosStandalone = (window.navigator as unknown as { standalone?: boolean }).standalone === true;

	return isDisplayStandalone || isIosStandalone;
}

/**
 * Checks whether the app can currently be installed via a deferred install prompt.
 */
export function canInstallPwa(): boolean {
	return deferredPrompt !== null;
}

/**
 * Checks whether the app is installed or running in standalone mode.
 */
export function isPwaInstalled(): boolean {
	return isStandalone() || isInstalledState;
}

function notifyListeners(): void {
	const installed = isPwaInstalled();
	const installable = canInstallPwa();
	for (const listener of listeners) {
		try {
			listener(installed, installable);
		} catch (e) {
			console.error('[PWA] Error in PWA state listener:', e);
		}
	}
}

/**
 * Initializes PWA install prompt listeners and detects current display mode.
 */
export function initPwa(): void {
	if (typeof window === 'undefined' || isInitialized) return;
	isInitialized = true;

	isInstalledState = isStandalone();

	window.addEventListener('beforeinstallprompt', (e) => {
		// Prevent the default mini-infobar or banner
		e.preventDefault();
		deferredPrompt = e as BeforeInstallPromptEvent;
		notifyListeners();
	});

	window.addEventListener('appinstalled', () => {
		deferredPrompt = null;
		isInstalledState = true;
		notifyListeners();
	});

	// Listen for display mode changes (e.g. entering standalone)
	const mql = window.matchMedia('(display-mode: standalone)');
	mql.addEventListener('change', (e) => {
		isInstalledState = e.matches;
		notifyListeners();
	});

	// Register service worker if supported
	if ('serviceWorker' in navigator) {
		void navigator.serviceWorker.register('/service-worker.js').catch((err) => {
			console.warn('[PWA] ServiceWorker registration warning:', err);
		});
	}
}

/**
 * Prompts the user to install the PWA if a prompt is available.
 * Returns true if the user accepted the prompt.
 */
export async function promptPwaInstall(): Promise<boolean> {
	if (!deferredPrompt) {
		return false;
	}

	try {
		await deferredPrompt.prompt();
		const choice = await deferredPrompt.userChoice;
		const accepted = choice.outcome === 'accepted';
		if (accepted) {
			deferredPrompt = null;
			isInstalledState = true;
		}
		notifyListeners();
		return accepted;
	} catch (err) {
		console.warn('[PWA] Error prompting PWA installation:', err);
		return false;
	}
}

/**
 * Subscribes to PWA installation state changes.
 */
export function onPwaChange(listener: PwaListener): () => void {
	listeners.add(listener);
	listener(isPwaInstalled(), canInstallPwa());
	return () => {
		listeners.delete(listener);
	};
}
