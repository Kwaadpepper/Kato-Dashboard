import { defineConfig } from 'vitepress';

export default defineConfig({
	title: 'Kato Dashboard',
	description: 'High-density zero-scroll monitoring wallboard for NOCs, TVs, and workstations.',
	base: '/kato-dashboard/',
	cleanUrls: true,
	head: [
		['link', { rel: 'icon', type: 'image/svg+xml', href: '/kato-dashboard/favicon.svg' }],
		['meta', { name: 'theme-color', content: '#10b981' }],
		['meta', { property: 'og:type', content: 'website' }],
		['meta', { property: 'og:title', content: 'Kato — High-Density Monitoring Wallboard' }],
		[
			'meta',
			{
				property: 'og:description',
				content:
					'Visualize 1 to 200+ probes on a single screen with zero scrolling. Built with Svelte 5, SSE, and multi-source aggregation for Uptime Kuma & UptimeRobot.'
			}
		],
		[
			'meta',
			{
				property: 'og:image',
				content: 'https://kwaadpepper.github.io/kato-dashboard/screenshots/kato-hero-dark.png'
			}
		]
	],

	themeConfig: {
		logo: '/logo.svg',
		search: {
			provider: 'local'
		},
		socialLinks: [
			{ icon: 'github', link: 'https://github.com/Kwaadpepper/kato-dashboard' }
		]
	},

	locales: {
		root: {
			label: 'English',
			lang: 'en-US',
			themeConfig: {
				nav: [
					{ text: 'Home', link: '/' },
					{ text: 'Quick Start', link: '/guide/getting-started' },
					{ text: 'Providers', link: '/guide/providers' },
					{ text: 'Features', link: '/guide/features' },
					{ text: 'Architecture', link: '/ARCHITECTURE' }
				],
				sidebar: [
					{
						text: 'Getting Started',
						items: [
							{ text: 'Quick Start (30s)', link: '/guide/getting-started' },
							{ text: 'Monitoring Providers', link: '/guide/providers' },
							{ text: 'Features & Modes', link: '/guide/features' },
							{ text: 'Environment Reference', link: '/guide/configuration' }
						]
					},
					{
						text: 'Technical Reference',
						items: [
							{ text: 'System Architecture', link: '/ARCHITECTURE' },
							{ text: 'Zero-Scroll Grid Engine', link: '/GRID_ALGORITHM' },
							{ text: 'Data Model & SSE', link: '/DATA_MODEL' },
							{ text: 'Colors & Themes', link: '/COLORS_AND_THEME' },
							{ text: 'UX Components', link: '/UX_COMPONENTS' },
							{ text: 'UptimeRobot API Notes', link: '/UPTIME_ROBOT_API' }
						]
					}
				],
				footer: {
					message: 'Released under the MIT License.',
					copyright: 'Copyright © 2026 Jeremy (Kwaadpepper)'
				}
			}
		},
		fr: {
			label: 'Français',
			lang: 'fr-FR',
			link: '/fr/',
			title: 'Kato Dashboard',
			description: 'Wallboard de supervision haute densité zéro-scroll pour écrans TV, NOC et postes opérateurs.',
			themeConfig: {
				nav: [
					{ text: 'Accueil', link: '/fr/' },
					{ text: 'Démarrage rapide', link: '/fr/guide/getting-started' },
					{ text: 'Sources & Adaptateurs', link: '/fr/guide/providers' },
					{ text: 'Fonctionnalités', link: '/fr/guide/features' },
					{ text: 'Architecture', link: '/fr/architecture' }
				],
				sidebar: [
					{
						text: 'Guide de mise en œuvre',
						items: [
							{ text: 'Démarrage en 30 secondes', link: '/fr/guide/getting-started' },
							{ text: 'Connecter vos sources', link: '/fr/guide/providers' },
							{ text: 'Fonctionnalités & Modes', link: '/fr/guide/features' },
							{ text: 'Variables d’environnement', link: '/fr/guide/configuration' }
						]
					},
					{
						text: 'Référence Technique',
						items: [
							{ text: 'Architecture & Algorithme', link: '/fr/architecture' },
							{ text: 'Spécifications détaillées (EN)', link: '/ARCHITECTURE' }
						]
					}
				],
				footer: {
					message: 'Publié sous licence MIT.',
					copyright: 'Copyright © 2026 Jeremy (Kwaadpepper)'
				},
				outline: {
					label: 'Sur cette page'
				},
				docFooter: {
					prev: 'Page précédente',
					next: 'Page suivante'
				}
			}
		}
	}
});
