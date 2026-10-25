# Environment Variables

All configuration is done through environment variables (`.env`, `docker run -e`, or `docker-compose.yml`).

---

## Monitoring Sources

| Variable | Default | Description |
| :--- | :---: | :--- |
| `UPTIME_KUMA_URL` | `""` | Base URL of your Uptime Kuma server (auto-enables Uptime Kuma). |
| `UPTIME_KUMA_API_KEY` | `""` | Uptime Kuma API key (`uk1_...`). |
| `UPTIME_KUMA_POLL_INTERVAL` | `60000` | Uptime Kuma polling interval in ms. |
| `UPTIMEROBOT_API_KEY` | `""` | UptimeRobot API key (auto-enables UptimeRobot). |
| `UPTIMEROBOT_POLL_INTERVAL` | `30000` | UptimeRobot polling interval in ms. |
| `KATO_ADAPTER` | `mock` | Explicit provider (`mock`, `uptimekuma`, `uptimerobot`, or comma-separated). |
| `KATO_ADAPTERS` | `""` | Multi-instance aliases (e.g., `kuma_prod,kuma_lan,robot_main`). |
| `KATO_MOCK_COUNT` | `50` | Number of simulated monitors in `mock` demo mode. |

### Multi-Instance Variables (`KATO_ADAPTERS`)
For each `<ALIAS>` in `KATO_ADAPTERS` (in uppercase):

| Variable | Default | Description |
| :--- | :---: | :--- |
| `ADAPTER_<ALIAS>_TYPE` | *Auto* | `uptimekuma`, `uptimerobot`, or `mock` (auto-detected if alias contains `kuma` or `robot`). |
| `ADAPTER_<ALIAS>_URL` | `""` | Base URL for `uptimekuma`. |
| `ADAPTER_<ALIAS>_API_KEY` | `""` | API key for `uptimekuma` or `uptimerobot`. |
| `ADAPTER_<ALIAS>_POLL_INTERVAL` | `30000` / `60000` | Polling interval in ms. |

---

## Security & Network

| Variable | Default | Description |
| :--- | :---: | :--- |
| `KATO_AUTH_ENABLED` | `false` | Require a password to access the dashboard. |
| `KATO_AUTH_PASSWORD` | `changeme` | Password when `KATO_AUTH_ENABLED=true`. |
| `PORT` / `HOST` | `3000` / `0.0.0.0` | Listening port and network address. |

---

## Default Display Preferences

| Variable | Default | Options | Description |
| :--- | :---: | :---: | :--- |
| `KATO_DEFAULT_LOCALE` | `en` | `en`, `fr` | Default UI language. |
| `KATO_DEFAULT_THEME` | `dark` | `dark`, `light`, `amoled`, `auto` | Default visual theme. |
| `KATO_DEFAULT_TIME_FORMAT` | `24h` | `24h`, `12h` | Clock format. |
| `KATO_DEFAULT_TIME_ZONE` | `local` | `local`, `UTC`, IANA TZ | Clock timezone (e.g., `Europe/Paris`). |
| `KATO_DEFAULT_SHOW_SECONDS` | `true` | `true`, `false` | Show seconds in the header clock. |
| `KATO_DEFAULT_SOUND_ENABLED` | `false` | `true`, `false` | Enable audio alerts by default. |
| `KATO_DEFAULT_NOTIFICATIONS_ENABLED` | `false` | `true`, `false` | Enable desktop notifications by default. |
| `KATO_DEFAULT_MARQUEE_SPEED` | `slow` | `slow`, `normal`, `fast` | Bottom incident ticker speed. |
