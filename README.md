<div align="center">

# Kato — High-Density Monitoring Wallboard

**Visualize 1 to 200+ monitoring probes on a single screen with guaranteed zero scrolling.**  
Aggregate multiple **Uptime Kuma** and **UptimeRobot** instances in real time via Server-Sent Events (SSE).

[![CI](https://github.com/Kwaadpepper/kato-dashboard/actions/workflows/ci.yml/badge.svg)](https://github.com/Kwaadpepper/kato-dashboard/actions/workflows/ci.yml)
[![Docker](https://github.com/Kwaadpepper/kato-dashboard/actions/workflows/docker.yml/badge.svg)](https://github.com/Kwaadpepper/kato-dashboard/pkgs/container/kato-dashboard)
[![Documentation](https://img.shields.io/badge/docs-GitHub%20Pages%20(EN%20%2F%20FR)-10b981)](https://kwaadpepper.github.io/kato-dashboard/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

[**📘 Documentation (English)**](https://kwaadpepper.github.io/kato-dashboard/) · [**🇫🇷 Documentation (Français)**](https://kwaadpepper.github.io/kato-dashboard/fr/) · [**🚀 Quick Start (30s)**](#-quick-start-30-seconds) · [**🐳 Docker Image**](https://github.com/Kwaadpepper/kato-dashboard/pkgs/container/kato-dashboard)

</div>

---

## 📸 Screenshots

![Kato Dashboard — Hero Wallboard View](docs/public/screenshots/kato-hero-dark.png)

| 24-Hour SLA & Outage Inspector | High-Density Zero-Scroll Matrix (110+ Probes) |
| :---: | :---: |
| ![Kato 24h Detail Modal](docs/public/screenshots/kato-detail-modal.png) | ![Kato High Density Grid](docs/public/screenshots/kato-high-density.png) |

---

## ✨ Why Kato?

- **📐 Guaranteed Zero-Scroll Grid**: Proprietary geometric layout engine computes optimal rows, columns, cell sizes, and **5 progressive density tiers** (`large`, `medium`, `compact`, `micro`, `pixel`) to fit 100% of your viewport without vertical or horizontal scrollbars.
- **🔌 Multi-Source Aggregation & Color Badges**: Connect multiple **Uptime Kuma** servers (e.g., Production + LAN) and **UptimeRobot** accounts simultaneously on a single unified wallboard. Each probe displays a deterministic color-coded source badge (`KP`, `KL`, `UR`).
- **⚡ Auto-Detection & Zero Database**: 100% in-memory SvelteKit Node.js BFF (Backend-For-Frontend). Pass `UPTIME_KUMA_URL` or `UPTIMEROBOT_API_KEY` and Kato automatically enables the right adapter—no database required, API keys never leave the server.
- **🎯 Smart Outage Prioritization**: Monitors experiencing outages (`DOWN`) automatically jump to the top-left of the screen, followed by `DEGRADED` monitors, healthy monitors sorted by criticality, and alphabetical order.
- **📺 24/7 TV & NOC Wallboard Mode (`?tv=1`)**: Automatic fullscreen, cursor auto-hide after 5s of inactivity, periodic OLED/AMOLED anti burn-in drift (±3px), Screen Wake Lock, and a continuous incident marquee ticker.
- **🔔 Desktop Notifications, Web Audio & PWA**:
  - Install as a standalone **Progressive Web App (PWA)** on desktop or mobile (with *Start app when you sign in* OS auto-launch support).
  - Native **Desktop Notifications** (`N`) with anti-flood grouping for mass incidents.
  - Pure Web Audio synthesizer chimes (`M`) for outage alerts and recovery notifications.
- **🕵️ Privacy / Screenshot Mode (`?anonymize=1`)**: One-click toggle in the Settings menu replaces sensitive probe names, URLs, and groups with realistic infrastructure placeholders while preserving your real statuses, latencies, and SLA percentages.
- **🌍 Bilingual & Accessible (WCAG AA)**: Full **English** and **French** localization, 4 high-contrast themes (**Dark**, **Light**, **AMOLED Pure Black**, **Auto**), and full 2D keyboard navigation.

---

## 🚀 Quick Start (30 Seconds)

### 1. One-Liner `docker run`

Try the interactive multi-source demo immediately, or connect directly to your Uptime Kuma / UptimeRobot instance:

```bash
# Instant Demo Mode (50 realistic multi-source probes)
docker run -d --name kato -p 3000:3000 ghcr.io/kwaadpepper/kato-dashboard:latest

# Connect directly to Uptime Kuma (Adapter auto-detected!)
docker run -d --name kato -p 3000:3000 \
  -e UPTIME_KUMA_URL=https://kuma.your-domain.com \
  -e UPTIME_KUMA_API_KEY=uk1_your_api_key \
  ghcr.io/kwaadpepper/kato-dashboard:latest

# Connect directly to UptimeRobot (Adapter auto-detected!)
docker run -d --name kato -p 3000:3000 \
  -e UPTIMEROBOT_API_KEY=u123456-your_readonly_token \
  ghcr.io/kwaadpepper/kato-dashboard:latest
```

Open **`http://localhost:3000`** in your browser (or **`http://localhost:3000/?tv=1`** for TV wallboard mode).

---

### 2. Standalone `docker-compose.yml` (No Clone Needed)

Create a `docker-compose.yml` file anywhere on your server:

```yaml
services:
  kato:
    image: ghcr.io/kwaadpepper/kato-dashboard:latest
    container_name: kato-dashboard
    ports:
      - "3000:3000"
    environment:
      # Provide Uptime Kuma and/or UptimeRobot credentials (auto-detected):
      UPTIME_KUMA_URL: "https://kuma.your-domain.com"
      UPTIME_KUMA_API_KEY: "uk1_your_api_key"
      # Optional UI defaults:
      KATO_DEFAULT_LOCALE: "en" # 'en' or 'fr'
      KATO_DEFAULT_THEME: "dark" # 'dark', 'light', 'amoled', 'auto'
    restart: unless-stopped
```

```bash
docker compose up -d
```

---

### 3. Multi-Instance Configuration (`KATO_ADAPTERS`)

Aggregate multiple Uptime Kuma servers and UptimeRobot accounts with distinct source badges (`KP`, `KL`, `RM`):

```dotenv
KATO_ADAPTERS=kuma_prod,kuma_lan,robot_main

# Instance 1: Production Uptime Kuma (Badge: KP)
ADAPTER_KUMA_PROD_URL=https://kuma.prod.acme.io
ADAPTER_KUMA_PROD_API_KEY=uk1_prod_token
ADAPTER_KUMA_PROD_POLL_INTERVAL=30000

# Instance 2: Internal LAN Uptime Kuma (Badge: KL)
ADAPTER_KUMA_LAN_URL=http://192.168.1.50:3001
ADAPTER_KUMA_LAN_API_KEY=uk1_lan_token
ADAPTER_KUMA_LAN_POLL_INTERVAL=15000

# Instance 3: UptimeRobot Cloud (Badge: RM)
ADAPTER_ROBOT_MAIN_API_KEY=u987654-secret
ADAPTER_ROBOT_MAIN_POLL_INTERVAL=60000
```

---

### 4. Run or Build from Source

```bash
# Clone the repository
git clone https://github.com/Kwaadpepper/kato-dashboard.git
cd kato-dashboard

# Copy configuration templates
cp .env.example .env
cp docker-compose.example.yml docker-compose.yml

# Option A: Run with Docker Compose
docker compose up -d

# Option B: Run locally with Node.js (20.x / 22.x+)
npm install
npm run dev
```

---

## ⚙️ Environment Variables Summary

| Variable | Default | Description |
| :--- | :---: | :--- |
| `KATO_ADAPTER` | `mock` | Simple mode provider (`mock`, `uptimerobot`, `uptimekuma`, or comma-separated). Auto-detected when `UPTIME_KUMA_URL` or `UPTIMEROBOT_API_KEY` is provided. |
| `KATO_ADAPTERS` | `""` | Named multi-instance adapter aliases (e.g. `kuma_prod,kuma_lan,robot_main`). |
| `KATO_MOCK_COUNT` | `50` | Number of simulated probes in `mock` demo mode. |
| `UPTIME_KUMA_URL` | `""` | Base URL of your Uptime Kuma instance (e.g. `https://kuma.example.com`). |
| `UPTIME_KUMA_API_KEY` | `""` | Uptime Kuma API key (`uk1_...`) for `/metrics` authentication. |
| `UPTIME_KUMA_POLL_INTERVAL` | `60000` | Uptime Kuma polling interval in milliseconds. |
| `UPTIMEROBOT_API_KEY` | `""` | UptimeRobot v3 read-only API key. |
| `UPTIMEROBOT_POLL_INTERVAL` | `30000` | UptimeRobot polling interval in milliseconds. |
| `KATO_AUTH_ENABLED` | `false` | Enable password authentication (`KATO_AUTH_PASSWORD`). |
| `KATO_DEFAULT_LOCALE` | `en` | Default UI language (`en` or `fr`). |
| `KATO_DEFAULT_THEME` | `dark` | Default theme (`dark`, `light`, `amoled`, `auto`). |
| `KATO_DEFAULT_SOUND_ENABLED` | `false` | Enable synthesizer audio alerts by default. |
| `KATO_DEFAULT_NOTIFICATIONS_ENABLED` | `false` | Enable desktop notifications by default. |
| `PORT` / `HOST` | `3000` / `0.0.0.0` | HTTP listening port and network interface. |

👉 See the [**Full Configuration & Architecture Documentation**](https://kwaadpepper.github.io/kato-dashboard/guide/configuration) for all advanced options.

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
| :--- | :--- |
| `Arrow Keys` / `Home` / `End` | 2D spatial navigation across the probe grid |
| `Enter` / `Space` | Open 24-hour detail & incident history drawer |
| `F` | Toggle fullscreen mode |
| `M` | Toggle Web Audio sound alerts |
| `N` | Toggle desktop notifications |
| `T` | Cycle color themes (`Dark` → `Light` → `AMOLED`) |
| `P` | Pause / resume bottom incident ticker |
| `?` | Open interactive Help & Shortcuts modal |
| `Escape` | Close modal / exit TV mode |

---

## 🧪 Development & Verification

```bash
# Run unit test suite (Node.js native test runner)
npm test

# TypeScript & Svelte 5 strict check
npm run check

# ESLint check
npm run lint

# Build production application & documentation site
npm run build
npm run docs:build
```

---

## 📄 License

Released under the [MIT License](LICENSE) © 2026 Jeremy ([Kwaadpepper](https://github.com/Kwaadpepper)).
