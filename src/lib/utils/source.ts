/**
 * Utility for formatting data source initials and deterministic color badges.
 * Designed for high-density wallboard monitoring cards.
 */

export interface SourceBadge {
	initials: string;
	source: string;
	className: string;
}

/**
 * Curated palette of non-conflicting accent styles.
 * Excludes emerald/green (UP), red/rose-red (DOWN), and amber (DEGRADED).
 */
const SOURCE_PALETTE = [
	{
		className: 'border-cyan-500/50 bg-cyan-950/60 text-cyan-300 dark:bg-cyan-950/70'
	},
	{
		className: 'border-violet-500/50 bg-violet-950/60 text-violet-300 dark:bg-violet-950/70'
	},
	{
		className: 'border-sky-500/50 bg-sky-950/60 text-sky-300 dark:bg-sky-950/70'
	},
	{
		className: 'border-fuchsia-500/50 bg-fuchsia-950/60 text-fuchsia-300 dark:bg-fuchsia-950/70'
	},
	{
		className: 'border-indigo-500/50 bg-indigo-950/60 text-indigo-300 dark:bg-indigo-950/70'
	},
	{
		className: 'border-teal-500/50 bg-teal-950/60 text-teal-300 dark:bg-teal-950/70'
	},
	{
		className: 'border-pink-500/50 bg-pink-950/60 text-pink-300 dark:bg-pink-950/70'
	}
];

/**
 * Computes deterministic hash from string.
 */
function hashString(str: string): number {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = (hash << 5) - hash + str.charCodeAt(i);
		hash |= 0;
	}
	return Math.abs(hash);
}

/**
 * Extracts 2 to 4 uppercase initials from a source provider name.
 *
 * Examples:
 * - "Uptime Kuma" -> "UK"
 * - "UptimeRobot" -> "UR"
 * - "UptimeKuma (dev)" -> "UKD"
 * - "kuma_prod" -> "KP"
 * - "kuma-1" -> "K1"
 * - "mock" -> "MOK"
 */
export function getSourceInitials(sourceName: string): string {
	const trimmed = sourceName.trim();
	if (!trimmed) return 'SRC';

	const lower = trimmed.toLowerCase();
	if (lower === 'uptimerobot') return 'UR';
	if (lower === 'uptimekuma') return 'UK';

	// Check for parenthetical identifier like "UptimeKuma (prod)" -> "UKP"
	const parenMatch = trimmed.match(/^([^(]+)\(([^)]+)\)$/);
	if (parenMatch) {
		const mainInitials = getSourceInitials(parenMatch[1]).slice(0, 2);
		const rawSub = parenMatch[2].trim();
		const subTokens = rawSub.replace(/([a-z0-9])([A-Z])/g, '$1 $2').split(/[\s_-]+/).filter(Boolean);
		let subInitials: string;
		if (subTokens.length >= 2) {
			subInitials = subTokens.map((t) => t[0]).join('').slice(0, 2);
		} else if (rawSub.length <= 2) {
			subInitials = rawSub;
		} else {
			subInitials = rawSub[0];
		}
		return (mainInitials + subInitials).toUpperCase().slice(0, 4);
	}

	// Split camelCase / PascalCase words like "UptimeKuma" -> "Uptime Kuma"
	const spaced = trimmed.replace(/([a-z0-9])([A-Z])/g, '$1 $2');

	// Split by space, underscore, or hyphen
	const tokens = spaced.split(/[\s_-]+/).filter(Boolean);

	if (tokens.length >= 2) {
		// Take first letter or alphanumeric char of each token
		const letters = tokens.map((t) => t[0]).join('');
		return letters.toUpperCase().slice(0, 4);
	}

	// Single token: take up to 3-4 chars
	const single = tokens[0] || trimmed;
	if (single.length <= 4) {
		return single.toUpperCase();
	}

	// Filter vowels from middle if > 4 chars, e.g. "Mock" -> "MOK"
	const clean = single.toUpperCase();
	return clean.slice(0, 3);
}

/**
 * Returns the source badge descriptor including initials and deterministic color styling.
 */
export function getSourceBadge(source: string | null | undefined): SourceBadge {
	const rawSource = (source || 'Default').trim();
	const initials = getSourceInitials(rawSource);
	const colorIndex = hashString(rawSource.toLowerCase()) % SOURCE_PALETTE.length;
	const palette = SOURCE_PALETTE[colorIndex];

	return {
		initials,
		source: rawSource,
		className: palette.className
	};
}
