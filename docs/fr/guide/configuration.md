# Variables d'Environnement

Toute la configuration s'effectue par variables d'environnement (`.env`, `docker run -e` ou `docker-compose.yml`).

---

## Sources de Supervision

| Variable | Défaut | Description |
| :--- | :---: | :--- |
| `UPTIME_KUMA_URL` | `""` | URL de votre serveur Uptime Kuma (active automatiquement Uptime Kuma). |
| `UPTIME_KUMA_API_KEY` | `""` | Clé API Uptime Kuma (`uk1_...`). |
| `UPTIME_KUMA_POLL_INTERVAL` | `60000` | Intervalle de rafraîchissement Uptime Kuma en ms. |
| `UPTIMEROBOT_API_KEY` | `""` | Clé API UptimeRobot (active automatiquement UptimeRobot). |
| `UPTIMEROBOT_POLL_INTERVAL` | `30000` | Intervalle de rafraîchissement UptimeRobot en ms. |
| `KATO_ADAPTER` | `mock` | Source explicite (`mock`, `uptimekuma`, `uptimerobot`, ou liste séparée par virgules). |
| `KATO_ADAPTERS` | `""` | Alias multi-instances (ex. `kuma_prod,kuma_lan,robot_main`). |
| `KATO_MOCK_COUNT` | `50` | Nombre de sondes simulées en mode démo (`mock`). |

### Variables Multi-Instances (`KATO_ADAPTERS`)
Pour chaque `<ALIAS>` déclaré dans `KATO_ADAPTERS` (en majuscules) :

| Variable | Défaut | Description |
| :--- | :---: | :--- |
| `ADAPTER_<ALIAS>_TYPE` | *Auto* | `uptimekuma`, `uptimerobot` ou `mock` (auto-détecté si l'alias contient `kuma` ou `robot`). |
| `ADAPTER_<ALIAS>_URL` | `""` | URL de base pour `uptimekuma`. |
| `ADAPTER_<ALIAS>_API_KEY` | `""` | Clé API pour `uptimekuma` ou `uptimerobot`. |
| `ADAPTER_<ALIAS>_POLL_INTERVAL` | `30000` / `60000` | Intervalle de rafraîchissement en ms. |

---

## Sécurité & Réseau

| Variable | Défaut | Description |
| :--- | :---: | :--- |
| `KATO_AUTH_ENABLED` | `false` | Protéger l'accès au dashboard par mot de passe. |
| `KATO_AUTH_PASSWORD` | `changeme` | Mot de passe requis lorsque `KATO_AUTH_ENABLED=true`. |
| `PORT` / `HOST` | `3000` / `0.0.0.0` | Port et adresse d'écoute HTTP. |

---

## Préférences d'Affichage par Défaut

| Variable | Défaut | Valeurs | Description |
| :--- | :---: | :---: | :--- |
| `KATO_DEFAULT_LOCALE` | `en` | `en`, `fr` | Langue par défaut de l'interface. |
| `KATO_DEFAULT_THEME` | `dark` | `dark`, `light`, `amoled`, `auto` | Thème visuel par défaut. |
| `KATO_DEFAULT_TIME_FORMAT` | `24h` | `24h`, `12h` | Format de l'horloge. |
| `KATO_DEFAULT_TIME_ZONE` | `local` | `local`, `UTC`, IANA TZ | Fuseau horaire (ex. `Europe/Paris`). |
| `KATO_DEFAULT_SHOW_SECONDS` | `true` | `true`, `false` | Afficher les secondes dans l'horloge. |
| `KATO_DEFAULT_SOUND_ENABLED` | `false` | `true`, `false` | Activer les alertes sonores par défaut. |
| `KATO_DEFAULT_NOTIFICATIONS_ENABLED` | `false` | `true`, `false` | Activer les notifications de bureau par défaut. |
| `KATO_DEFAULT_MARQUEE_SPEED` | `slow` | `slow`, `normal`, `fast` | Vitesse de défilement du bandeau d'incidents. |
