---
layout: home

hero:
  name: "Kato Dashboard"
  text: "Wallboard de Supervision Zéro-Scroll"
  tagline: "Visualisez de 1 à plus de 200 sondes sur un seul écran sans aucun défilement. Agrégez plusieurs instances Uptime Kuma et UptimeRobot en temps réel via Server-Sent Events."
  image:
    src: /logo.svg
    alt: Logo Kato Dashboard
  actions:
    - theme: brand
      text: Démarrage en 30s
      link: /fr/guide/getting-started
    - theme: alt
      text: Connecter vos sources
      link: /fr/guide/providers
    - theme: alt
      text: Voir sur GitHub
      link: https://github.com/Kwaadpepper/kato-dashboard

features:
  - icon: 📐
    title: Grille Zéro-Scroll Garantie
    details: Moteur géométrique adaptatif calculant dynamiquement colonnes, lignes et 5 paliers de densité (large, medium, compact, micro, pixel) pour occuper 100% de l'écran.
  - icon: 🔌
    title: Multi-Sources & Pastilles Colorées
    details: Agrégez simultanément plusieurs serveurs Uptime Kuma et comptes UptimeRobot sur un même écran, identifiés par des pastilles colorées automatiques (KP, KL, UR).
  - icon: ⚡
    title: Temps Réel SSE & Tri Intelligent
    details: Flux Server-Sent Events différentiel ultra-léger. Les sondes en panne (DOWN) et dégradées (DEGRADED) remontent automatiquement en haut à gauche.
  - icon: 📺
    title: Mode TV & NOC 24/7 (?tv=1)
    details: Conçu pour les écrans muraux avec plein écran automatique, masquage du curseur, dérive anti burn-in OLED/AMOLED, Wake Lock et bandeau d'incidents défilant.
  - icon: 🔔
    title: Notifications Bureau, Audio & PWA
    details: Installez Kato comme application de bureau/mobile (PWA avec lancement au démarrage de l'OS), recevez des notifications système et des alertes sonores synthétisées.
  - icon: 🕵️
    title: Zéro Base de Données & Mode Capture
    details: Architecture BFF Node.js 100% en mémoire vive, avec un Mode Anonymisation intégré pour masquer vos noms de serveurs et URLs sensibles en un clic lors d'une capture d'écran.
---

## Aperçu du Wallboard en Temps Réel

![Aperçu principal Kato Dashboard](/screenshots/kato-hero-dark.png)

## Lancer Kato en Une Seule Commande

Démarrez Kato instantanément en mode démo multi-sources ou connectez-le directement à votre instance Uptime Kuma / UptimeRobot — **l'auto-détection de l'adaptateur** s'occupe du reste :

```bash
# Mode démo instantané (50 sondes multi-sources simulées)
docker run -d --name kato -p 3000:3000 ghcr.io/kwaadpepper/kato-dashboard:latest

# Ou connexion directe à Uptime Kuma (auto-détecté)
docker run -d --name kato -p 3000:3000 \
  -e UPTIME_KUMA_URL=https://kuma.votre-domaine.fr \
  -e UPTIME_KUMA_API_KEY=uk1_votre_cle_api \
  ghcr.io/kwaadpepper/kato-dashboard:latest
```

## Inspection Détaillée 24h & Vues Haute Densité

| Panneau d'Inspection SLA 24h & Incidents | Matrice Haute Densité (110+ sondes) |
| :--- | :--- |
| ![Modale de détail 24h Kato](/screenshots/kato-detail-modal.png) | ![Grille Haute Densité Kato](/screenshots/kato-high-density.png) |
| Cliquez sur n'importe quelle sonde pour inspecter sa latence, son SLA 24h/7j, sa frise horaire sur 24 heures et le journal chronologique des pannes. | S'adapte automatiquement en tuiles compactes, micro ou pixels à mesure que votre parc grandit — sans jamais afficher de barre de défilement. |
