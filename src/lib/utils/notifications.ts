/**
 * Browser Desktop Notifications module for Kato Dashboard.
 * Handles permission requests, persistence in localStorage,
 * and dispatching notifications when probe statuses change.
 */

import type { NormalizedProbe, ProbeStatus, SupportedLocale } from '$lib/types';

export const NOTIFICATION_STORAGE_KEY = 'kato-notifications-enabled';

export type NotificationPermissionState = NotificationPermission | 'unsupported';
export type NotificationListener = (
	enabled: boolean,
	permission: NotificationPermissionState
) => void;

let notificationsEnabledState = false;
const listeners = new Set<NotificationListener>();

/**
 * Checks if the Web Notifications API is supported in the current environment.
 */
export function isNotificationSupported(): boolean {
	return typeof window !== 'undefined' && 'Notification' in window;
}

/**
 * Retrieves the current notification permission or 'unsupported' in non-browser/SSR environments.
 */
export function getNotificationPermission(): NotificationPermissionState {
	if (!isNotificationSupported()) return 'unsupported';
	return Notification.permission;
}

/**
 * Checks whether desktop notifications are enabled by the user (localStorage or BFF default).
 */
export function isNotificationEnabled(bffDefault?: boolean): boolean {
	if (typeof window === 'undefined') return bffDefault ?? false;
	try {
		const saved = localStorage.getItem(NOTIFICATION_STORAGE_KEY);
		if (saved !== null) {
			notificationsEnabledState = saved === 'true';
			return notificationsEnabledState;
		}
	} catch (err) {
		console.warn('[Notifications] Failed to read from localStorage:', err);
	}
	if (typeof bffDefault === 'boolean') {
		notificationsEnabledState = bffDefault;
	}
	return notificationsEnabledState;
}

/**
 * Initializes notification state considering BFF default setting.
 */
export function initNotifications(bffDefault?: boolean): boolean {
	return isNotificationEnabled(bffDefault);
}

function notifyListeners(): void {
	const enabled = isNotificationEnabled();
	const permission = getNotificationPermission();
	for (const listener of listeners) {
		try {
			listener(enabled, permission);
		} catch (e) {
			console.error('[Notifications] Error in notification listener:', e);
		}
	}
}

/**
 * Enables or disables desktop notifications, requesting permission if needed.
 * Returns true if notifications are active and permission is granted.
 */
export async function setNotificationEnabled(enabled: boolean): Promise<boolean> {
	if (!isNotificationSupported()) {
		notificationsEnabledState = false;
		notifyListeners();
		return false;
	}

	if (enabled) {
		let perm = Notification.permission;
		if (perm === 'default') {
			try {
				const req = Notification.requestPermission();
				if (req && typeof (req as Promise<NotificationPermission>).then === 'function') {
					perm = await req;
				} else {
					perm = await new Promise<NotificationPermission>((resolve) => {
						Notification.requestPermission(resolve);
					});
				}
			} catch (err) {
				console.warn('[Notifications] Failed to request permission:', err);
				perm = Notification.permission;
			}
		}

		if (perm === 'granted') {
			notificationsEnabledState = true;
		} else {
			notificationsEnabledState = false;
		}
	} else {
		notificationsEnabledState = false;
	}

	try {
		localStorage.setItem(NOTIFICATION_STORAGE_KEY, String(notificationsEnabledState));
	} catch (err) {
		console.warn('[Notifications] Failed to write to localStorage:', err);
	}

	notifyListeners();
	return notificationsEnabledState;
}

/**
 * Toggles desktop notifications state.
 */
export async function toggleNotification(): Promise<boolean> {
	const current = isNotificationEnabled();
	return setNotificationEnabled(!current);
}

/**
 * Subscribes to notification state changes (enabled and permission).
 */
export function onNotificationChange(listener: NotificationListener): () => void {
	listeners.add(listener);
	listener(isNotificationEnabled(), getNotificationPermission());
	return () => {
		listeners.delete(listener);
	};
}

export interface EmitNotificationOptions {
	locale?: SupportedLocale;
	onClick?: () => void;
}

/**
 * Dispatches a desktop notification when a probe transitions between states.
 */
export function emitProbeStatusNotification(
	probe: NormalizedProbe,
	oldStatus: ProbeStatus,
	newStatus: ProbeStatus,
	options?: EmitNotificationOptions
): Notification | null {
	if (!isNotificationSupported() || !isNotificationEnabled()) return null;
	if (Notification.permission !== 'granted') return null;

	const locale = options?.locale ?? 'en';
	const isFr = locale === 'fr';

	let title: string;
	if (newStatus === 'down') {
		title = isFr ? `🔴 ${probe.name} est DOWN` : `🔴 ${probe.name} is DOWN`;
	} else if (newStatus === 'up') {
		title = isFr ? `🟢 ${probe.name} est rétabli (UP)` : `🟢 ${probe.name} is restored (UP)`;
	} else if (newStatus === 'degraded') {
		title = isFr ? `🟡 ${probe.name} est dégradé` : `🟡 ${probe.name} is degraded`;
	} else {
		title = `${probe.name} : ${newStatus.toUpperCase()}`;
	}

	const bodyParts: string[] = [
		isFr
			? `Statut : ${oldStatus.toUpperCase()} ➔ ${newStatus.toUpperCase()}`
			: `Status: ${oldStatus.toUpperCase()} ➔ ${newStatus.toUpperCase()}`
	];

	if (probe.responseTime !== null && probe.responseTime !== undefined && probe.responseTime > 0) {
		bodyParts.push(`${probe.responseTime}ms`);
	}

	if (probe.url) {
		bodyParts.push(probe.url);
	}

	const body = bodyParts.join(' • ');

	try {
		const notif = new Notification(title, {
			body,
			icon: '/favicon.svg',
			tag: `kato-probe-${probe.id}`,
			silent: false
		});

		notif.onclick = () => {
			try {
				if (typeof window !== 'undefined') {
					window.focus();
				}
			} catch {}
			options?.onClick?.();
			notif.close();
		};

		// Auto-close notification after 8 seconds
		setTimeout(() => {
			try {
				notif.close();
			} catch {}
		}, 8000);

		return notif;
	} catch (err) {
		console.warn('[Notifications] Failed to instantiate Notification:', err);
		return null;
	}
}

/**
 * Dispatches a consolidated desktop notification when multiple probes change state simultaneously.
 */
export function emitMultipleStatusChangesNotification(
	count: number,
	options?: EmitNotificationOptions
): Notification | null {
	if (!isNotificationSupported() || !isNotificationEnabled()) return null;
	if (Notification.permission !== 'granted') return null;

	const locale = options?.locale ?? 'en';
	const isFr = locale === 'fr';

	const title = isFr
		? `⚠️ ${count} sondes ont changé d’état`
		: `⚠️ ${count} probes changed state`;
	const body = isFr
		? 'Mise à jour groupée du tableau de bord Kato'
		: 'Bulk status update in Kato Dashboard';

	try {
		const notif = new Notification(title, {
			body,
			icon: '/favicon.svg',
			tag: 'kato-mass-change',
			silent: false
		});

		notif.onclick = () => {
			try {
				if (typeof window !== 'undefined') {
					window.focus();
				}
			} catch {}
			options?.onClick?.();
			notif.close();
		};

		setTimeout(() => {
			try {
				notif.close();
			} catch {}
		}, 8000);

		return notif;
	} catch (err) {
		console.warn('[Notifications] Failed to instantiate Notification:', err);
		return null;
	}
}
