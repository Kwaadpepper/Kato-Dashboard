# Référence des Variables d'Environnement

Toute la configuration de Kato s'effectue par variables d'environnement (fichier `.env`, `docker run -e` ou `docker-compose.yml`).

---

## Adaptateurs de Supervision

| Variable | Défaut | Description |
| :--- | :---: | :--- |
| `KATO_ADAPTER` | `mock` | Adaptateur en mode simple (`mock`, `uptimerobot`, `uptimekuma`, ou liste `uptimerobot,uptimekuma`). Auto-détecté si `UPTIME_KUMA_URL` ou `UPTIMEROBOT_API_KEY` est fourni ! |
| `KATO_ADAPTERS` | `""` | Mode multi-instances : liste d'alias séparés par des virgules (ex. `kuma_prod,kuma_lan,robot_main`). |
| `KATO_MOCK_COUNT` | `50` | Nombre de sondes simulées en mode `mock`. |
| `UPTIME_KUMA_URL` | `""` | URL de base de votre instance Uptime Kuma en mode simple. |
| `UPTIME_KUMA_API_KEY` | `""` | Clé API Uptime Kuma (`uk1_...`) pour l'endpoint `/metrics`. |
| `UPTIME_KUMA_POLL_INTERVAL` | `60000` | Intervalle de collecte Uptime Kuma en millisecondes. |
| `UPTIMEROBOT_API_KEY` | `""` | Clé API UptimeRobot v3 en mode simple. |
| `UPTIMEROBOT_POLL_INTERVAL` | `30000` | Intervalle de collecte UptimeRobot en millisecondes. |

### Variables par Instance (`KATO_ADAPTERS`)
Pour chaque `<ALIAS>` déclaré dans `KATO_ADAPTERS` (converti en majuscules avec underscores) :

| Variable | Défaut | Description |
| :--- | :---: | :--- |
| `ADAPTER_<ALIAS>_TYPE` | *Auto* | `uptimekuma`, `uptimerobot` ou `mock` (déduit automatiquement si l'alias contient `kuma` ou `robot`). |
| `ADAPTER_<ALIAS>_URL` | `""` | URL de base (requis pour `uptimekuma`). |
| `ADAPTER_<ALIAS>_API_KEY` | `""` | Clé API pour `uptimekuma` ou `uptimerobot`. |
| `ADAPTER_<ALIAS>_POLL_INTERVAL` | `30000` / `60000` | Intervalle de collecte spécifique à cette instance (en ms). |
| `ADAPTER_<ALIAS>_COUNT` | `50` | Nombre de sondes lorsque `TYPE=mock`. |

---

## Sécurité & Réseau

| Variable | Défaut | Description |
| :--- | :---: | :--- |
| `KATO_AUTH_ENABLED` | `false` | Active la protection par mot de passe sur le dashboard et le flux SSE. |
| `KATO_AUTH_PASSWORD` | `changeme` | Mot de passe requis lorsque `KATO_AUTH_ENABLED=true`. |
| `PORT` | `3000` | Port d'écoute HTTP du serveur Node.js de production. |
| `HOST` | `0.0.0.0` | Interface réseau d'écoute. |

> [!NOTE]
> Le point de terminaison `GET /api/health` reste toujours accessible sans authentification afin de permettre les vérifications `HEALTHCHECK` Docker et Kubernetes.

---

## Préférences Client par Défaut (BFF)

Ces variables définissent les réglages initiaux appliqués aux nouveaux navigateurs :

| Variable | Défaut | Valeurs acceptées | Description |
| :--- | :---: | :---: | :--- |
| `KATO_DEFAULT_LOCALE` | `en` | `en`, `fr` | Langue par défaut de l'interface. |
| `KATO_DEFAULT_THEME` | `dark` | `dark`, `light`, `amoled`, `auto` | Thème visuel par défaut. |
| `KATO_DEFAULT_TIME_FORMAT` | `24h` | `24h`, `12h` | Format d'affichage de l'horloge. |
| `KATO_DEFAULT_TIME_ZONE` | `local` | `local`, `UTC`, IANA TZ | Fuseau horaire de l'horloge (ex. `Europe/Paris`). |
| `KATO_DEFAULT_SHOW_SECONDS` | `true` | `true`, `false` | Afficher ou masquer les secondes dans l'horloge. |
| `KATO_DEFAULT_SOUND_ENABLED` | `false` | `true`, `false` | Activer les alertes sonores par défaut. |
| `KATO_DEFAULT_NOTIFICATIONS_ENABLED` | `false` | `true`, `false` | Activer les notifications de bureau par défaut. |
| `KATO_DEFAULT_MARQUEE_SPEED` | `slow` | `slow`, `normal`, `fast` | Vitesse de défilement de la barre d'incidents. |
| `KATO_DEFAULT_SORT_MODE` | `smart` | `smart`, `alpha`, `group` | Mode de tri par défaut des sondes. |
