---
layout: home

hero:
  name: "Kato Dashboard"
  text: "Zero-Scroll Monitoring Wallboard"
  tagline: "Display 1 to 200+ Uptime Kuma and UptimeRobot monitors on a single screen with zero scrolling. Built for TVs, NOC wallboards, and operator desks."
  image:
    src: /logo.svg
    alt: Kato Dashboard Logo
  actions:
    - theme: brand
      text: Quick Start (30s)
      link: /guide/getting-started
    - theme: alt
      text: Connect Sources
      link: /guide/providers
    - theme: alt
      text: View on GitHub
      link: https://github.com/Kwaadpepper/kato-dashboard

features:
  - icon: 📐
    title: Guaranteed Zero-Scroll Grid
    details: Automatically scales cards from detailed tiles down to compact cells so 100% of your monitors fit on screen without a scrollbar.
  - icon: 🔌
    title: Multi-Source Aggregation
    details: Combine multiple Uptime Kuma servers and UptimeRobot accounts on one unified screen with color-coded source badges.
  - icon: 🎯
    title: Smart Outage Priority
    details: Monitors experiencing outages (DOWN) or slowdowns (DEGRADED) immediately move to the top-left of your screen.
  - icon: 📺
    title: 24/7 TV Wallboard Mode (?tv=1)
    details: Auto-fullscreen, cursor auto-hide, OLED anti burn-in protection, Screen Wake Lock, and a live bottom incident ticker.
  - icon: 🔔
    title: Desktop & Audio Alerts
    details: Install as a desktop/mobile Web App (PWA), receive native OS notifications, and enable built-in audio chimes for outages.
  - icon: 🕵️
    title: Privacy / Screenshot Mode
    details: Anonymize monitor names and URLs in one click while keeping your real statuses, latencies, and uptime percentages.
---

## Live Wallboard Preview

![Kato Dashboard Hero View](/screenshots/kato-hero-dark.png)

### Launch in One Command

Try Kato immediately in demo mode or point it directly at your Uptime Kuma / UptimeRobot instance:

```bash
# Instant demo mode
docker run -d --name kato -p 3000:3000 ghcr.io/kwaadpepper/kato-dashboard:latest

# Or connect directly to Uptime Kuma
docker run -d --name kato -p 3000:3000 \
  -e UPTIME_KUMA_URL=https://kuma.your-domain.com \
  -e UPTIME_KUMA_API_KEY=uk1_your_api_key \
  ghcr.io/kwaadpepper/kato-dashboard:latest
```

## 24-Hour Inspection & High-Density Views

| 24-Hour SLA & Incident Inspector | High-Density Matrix (110+ Monitors) |
| :--- | :--- |
| ![Kato 24h Detail Modal](/screenshots/kato-detail-modal.png) | ![Kato High Density Grid](/screenshots/kato-high-density.png) |
| Click any monitor to inspect latency, 24h/7d availability, hourly status bars, and recent outages. | Automatically adapts tile density as your infrastructure grows — without ever adding a scrollbar. |
