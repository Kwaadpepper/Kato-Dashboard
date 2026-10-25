# Environment Configuration Reference

Kato is configured entirely through environment variables (via `.env`, `docker run -e`, or `docker-compose.yml`).

---

## Monitoring Adapters

| Variable | Default | Description |
| :--- | :---: | :--- |
| `KATO_ADAPTER` | `mock` | Simple mode provider (`mock`, `uptimerobot`, `uptimekuma`, or comma-separated `uptimerobot,uptimekuma`). Auto-detected if `UPTIME_KUMA_URL` or `UPTIMEROBOT_API_KEY` is set! |
| `KATO_ADAPTERS` | `""` | Multi-instance mode: comma-separated list of instance aliases (e.g., `kuma_prod,kuma_lan,robot_main`). |
| `KATO_MOCK_COUNT` | `50` | Number of simulated probes generated in `mock` mode. |
| `UPTIME_KUMA_URL` | `""` | Base URL of your Uptime Kuma server in simple mode (e.g., `https://kuma.example.com`). |
| `UPTIME_KUMA_API_KEY` | `""` | Uptime Kuma API key (`uk1_...`) for `/metrics` authentication. |
| `UPTIME_KUMA_POLL_INTERVAL` | `60000` | Polling interval in milliseconds for Uptime Kuma. |
| `UPTIMEROBOT_API_KEY` | `""` | UptimeRobot v3 API key in simple mode. |
| `UPTIMEROBOT_POLL_INTERVAL` | `30000` | Polling interval in milliseconds for UptimeRobot. |

### Per-Instance Variables (`KATO_ADAPTERS`)
For each `<ALIAS>` listed in `KATO_ADAPTERS` (converted to uppercase alphanumeric + underscores):

| Variable | Default | Description |
| :--- | :---: | :--- |
| `ADAPTER_<ALIAS>_TYPE` | *Inferred* | `uptimekuma`, `uptimerobot`, or `mock` (auto-inferred if alias contains `kuma` or `robot`). |
| `ADAPTER_<ALIAS>_URL` | `""` | Base URL (required for `uptimekuma`). |
| `ADAPTER_<ALIAS>_API_KEY` | `""` | API key for `uptimekuma` or `uptimerobot`. |
| `ADAPTER_<ALIAS>_POLL_INTERVAL` | `30000` / `60000` | Custom polling interval in milliseconds for this instance. |
| `ADAPTER_<ALIAS>_COUNT` | `50` | Probe count when `TYPE=mock`. |

---

## Security & Server Binding

| Variable | Default | Description |
| :--- | :---: | :--- |
| `KATO_AUTH_ENABLED` | `false` | Enable session-based password authentication for the dashboard and SSE stream. |
| `KATO_AUTH_PASSWORD` | `changeme` | Password required to log in when `KATO_AUTH_ENABLED=true`. |
| `PORT` | `3000` | HTTP port the production Node.js server listens on. |
| `HOST` | `0.0.0.0` | Network interface binding address. |

> [!NOTE]
> The health check endpoint `GET /api/health` remains accessible even when `KATO_AUTH_ENABLED=true` so Docker and Kubernetes probes can verify container liveness without credentials.

---

## Default Client Preferences (BFF)

These variables define the initial settings served to browsers that do not yet have `localStorage` overrides:

| Variable | Default | Allowed Values | Description |
| :--- | :---: | :---: | :--- |
| `KATO_DEFAULT_LOCALE` | `en` | `en`, `fr` | Default interface language. |
| `KATO_DEFAULT_THEME` | `dark` | `dark`, `light`, `amoled`, `auto` | Default color theme. |
| `KATO_DEFAULT_TIME_FORMAT` | `24h` | `24h`, `12h` | Header clock time format. |
| `KATO_DEFAULT_TIME_ZONE` | `local` | `local`, `UTC`, IANA TZ | Header clock timezone (e.g., `Europe/Paris`, `America/New_York`). |
| `KATO_DEFAULT_SHOW_SECONDS` | `true` | `true`, `false` | Display seconds in the header clock. |
| `KATO_DEFAULT_SOUND_ENABLED` | `false` | `true`, `false` | Enable Web Audio synthesizer alerts by default. |
| `KATO_DEFAULT_NOTIFICATIONS_ENABLED` | `false` | `true`, `false` | Enable desktop notifications by default (once browser permission is granted). |
| `KATO_DEFAULT_MARQUEE_SPEED` | `slow` | `slow`, `normal`, `fast` | Incident footer marquee scrolling speed preset. |
| `KATO_DEFAULT_SORT_MODE` | `smart` | `smart`, `alpha`, `group` | Default probe sorting strategy. |
