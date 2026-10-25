---
layout: home

hero:
  name: "Kato Dashboard"
  text: "Wallboard de Supervision Zéro-Scroll"
  tagline: "Affichez de 1 à plus de 200 sondes Uptime Kuma et UptimeRobot sur un seul écran sans aucun défilement. Conçu pour les écrans TV, NOC et postes opérateurs."
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
    details: Adapte automatiquement la taille des cartes pour que 100 % de vos sondes tiennent sur l'écran sans barre de défilement.
  - icon: 🔌
    title: Agrégation Multi-Sources
    details: Regroupez plusieurs serveurs Uptime Kuma et comptes UptimeRobot sur un même écran avec des pastilles de couleur par source.
  - icon: 🎯
    title: Priorité aux Pannes
    details: Les services en panne (DOWN) ou ralentis (DEGRADED) remontent automatiquement en haut à gauche de l'écran.
  - icon: 📺
    title: Mode TV 24/7 (?tv=1)
    details: Plein écran automatique, masquage du curseur, protection anti burn-in OLED, maintien de l'écran allumé et bandeau d'incidents.
  - icon: 🔔
    title: Alertes Bureau & Audio
    details: Installez Kato comme application (PWA), recevez des notifications système et activez les alertes sonores en cas d'incident.
  - icon: 🕵️
    title: Mode Anonymisation (Capture)
    details: Masquez vos noms de serveurs et URLs en un clic tout en conservant vos vrais statuts, latences et taux de disponibilité.
---

## Aperçu du Wallboard

![Aperçu principal Kato Dashboard](/screenshots/kato-hero-dark.png)

### Lancer Kato en Une Commande

Testez immédiatement le mode démo ou connectez directement votre instance Uptime Kuma / UptimeRobot :

```bash
# Mode démo instantané
docker run -d --name kato -p 3000:3000 ghcr.io/kwaadpepper/kato-dashboard:latest

# Ou connexion directe à Uptime Kuma
docker run -d --name kato -p 3000:3000 \
  -e UPTIME_KUMA_URL=https://kuma.votre-domaine.fr \
  -e UPTIME_KUMA_API_KEY=uk1_votre_cle_api \
  ghcr.io/kwaadpepper/kato-dashboard:latest
```

## Inspection 24h & Vues Haute Densité

| Panneau de Détail 24h & Incidents | Matrice Haute Densité (110+ sondes) |
| :--- | :--- |
| ![Modale de détail 24h Kato](/screenshots/kato-detail-modal.png) | ![Grille Haute Densité Kato](/screenshots/kato-high-density.png) |
| Cliquez sur une sonde pour consulter sa latence, sa disponibilité 24h/7j et l'historique des coupures. | Adapte automatiquement la taille des tuiles à mesure que votre parc grandit — sans jamais ajouter de défilement. |
