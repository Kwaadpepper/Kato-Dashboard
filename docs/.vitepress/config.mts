import { defineConfig } from 'vitepress';

export default defineConfig({
	title: 'Kato Dashboard',
	description: 'High-density zero-scroll monitoring wallboard for TVs, NOCs, and workstations.',
	base: '/',
	cleanUrls: true,
	head: [
		['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
		['meta', { name: 'theme-color', content: '#10b981' }],
		['meta', { property: 'og:type', content: 'website' }],
		['meta', { property: 'og:title', content: 'Kato — High-Density Monitoring Wallboard' }],
		[
			'meta',
			{
				property: 'og:description',
				content:
					'Display all your Uptime Kuma and UptimeRobot monitors on a single screen with zero scrolling.'
			}
		],
		[
			'meta',
			{
				property: 'og:image',
				content: 'https://kato.jeremydev.ovh/screenshots/kato-hero-dark.png'
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
					{ text: 'Configuration', link: '/guide/configuration' }
				],
				sidebar: [
					{
						text: 'User Guide',
						items: [
							{ text: 'Quick Start', link: '/guide/getting-started' },
							{ text: 'Monitoring Sources', link: '/guide/providers' },
							{ text: 'Features & TV Mode', link: '/guide/features' },
							{ text: 'Environment Variables', link: '/guide/configuration' }
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
			description: 'Wallboard de supervision haute densité zéro-scroll pour écrans TV et NOC.',
			themeConfig: {
				nav: [
					{ text: 'Accueil', link: '/fr/' },
					{ text: 'Démarrage rapide', link: '/fr/guide/getting-started' },
					{ text: 'Sources', link: '/fr/guide/providers' },
					{ text: 'Fonctionnalités', link: '/fr/guide/features' },
					{ text: 'Configuration', link: '/fr/guide/configuration' }
				],
				sidebar: [
					{
						text: 'Guide Utilisateur',
						items: [
							{ text: 'Démarrage rapide', link: '/fr/guide/getting-started' },
							{ text: 'Connecter vos sources', link: '/fr/guide/providers' },
							{ text: 'Fonctionnalités & Mode TV', link: '/fr/guide/features' },
							{ text: 'Variables d’environnement', link: '/fr/guide/configuration' }
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
