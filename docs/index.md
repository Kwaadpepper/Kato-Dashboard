---
layout: home

hero:
  name: "Kato Dashboard"
  text: "Zero-Scroll Monitoring Wallboard"
  tagline: "Visualize 1 to 200+ probes on a single screen with zero scrolling. Aggregate multiple Uptime Kuma and UptimeRobot instances in real time via Server-Sent Events."
  image:
    src: /logo.svg
    alt: Kato Dashboard Logo
  actions:
    - theme: brand
      text: Quick Start (30s)
      link: /guide/getting-started
    - theme: alt
      text: Connect Providers
      link: /guide/providers
    - theme: alt
      text: View on GitHub
      link: https://github.com/Kwaadpepper/kato-dashboard

features:
  - icon: 📐
    title: Guaranteed Zero-Scroll Grid
    details: Proprietary geometric layout engine computes optimal rows, columns, cell sizes, and 5 progressive density tiers (large, medium, compact, micro, pixel) to fit 100% of any screen.
  - icon: 🔌
    title: Multi-Source Aggregation & Badges
    details: Combine multiple Uptime Kuma servers and UptimeRobot accounts simultaneously on one unified wallboard, with color-coded source badges (KP, KL, UR).
  - icon: ⚡
    title: Real-Time SSE & Smart Prioritization
    details: Differential Server-Sent Events push changes in milliseconds. Outages (DOWN) and degraded services automatically bubble up to the top-left of the grid.
  - icon: 📺
    title: 24/7 TV & NOC Mode (?tv=1)
    details: Built for wall-mounted displays with automatic fullscreen, cursor auto-hide, OLED/AMOLED anti burn-in pixel drift, Screen Wake Lock, and continuous incident ticker.
  - icon: 🔔
    title: Desktop Notifications, Audio & PWA
    details: Install as a standalone desktop/mobile Progressive Web App (with Run on OS Login support), receive native OS notifications, and Web Audio synthesizer chimes.
  - icon: 🕵️
    title: Zero Database & Privacy Mode
    details: 100% in-memory Node.js BFF with instant startup, plus a built-in Privacy / Screenshot Mode to anonymize sensitive probe names and URLs in one click.
---

## Live Wallboard Preview

![Kato Dashboard Hero View](/screenshots/kato-hero-dark.png)

##Launch in One Command

Run Kato immediately in multi-source demo mode or point it directly at your Uptime Kuma / UptimeRobot instance — **adapter auto-detection** handles the rest:

```bash
# Instant demo mode (50 simulated multi-source probes)
docker run -d --name kato -p 3000:3000 ghcr.io/kwaadpepper/kato-dashboard:latest

# Or connect directly to Uptime Kuma (auto-detected)
docker run -d --name kato -p 3000:3000 \
  -e UPTIME_KUMA_URL=https://kuma.your-domain.com \
  -e UPTIME_KUMA_API_KEY=uk1_your_api_key \
  ghcr.io/kwaadpepper/kato-dashboard:latest
```

## Detailed 24-Hour Inspection & High-Density Views

| 24-Hour SLA & Incident Inspector | 110+ Probes High-Density Matrix |
| :--- | :--- |
| ![Kato 24h Detail Modal](/screenshots/kato-detail-modal.png) | ![Kato High Density Grid](/screenshots/kato-high-density.png) |
| Click any probe to inspect real-time latency, 24h/7d SLA availability, hourly status slots, and chronological outage history. | Automatically scales down to compact, micro, or pixel cells as your infrastructure grows — without ever introducing a scrollbar. |
