# Quick Start

Kato runs as a lightweight container (`ghcr.io/kwaadpepper/kato-dashboard:latest`) requiring no database.

---

## 1. One-Liner `docker run`

### Try the Built-in Demo
```bash
docker run -d --name kato-dashboard -p 3000:3000 ghcr.io/kwaadpepper/kato-dashboard:latest
```

Open **`http://localhost:3000`** in your browser.

### Connect to Uptime Kuma or UptimeRobot
Provide `UPTIME_KUMA_URL` or `UPTIMEROBOT_API_KEY` and Kato automatically activates the provider:

```bash
# Uptime Kuma
docker run -d \
  --name kato-dashboard \
  -p 3000:3000 \
  -e UPTIME_KUMA_URL=https://kuma.your-domain.com \
  -e UPTIME_KUMA_API_KEY=uk1_your_api_key \
  ghcr.io/kwaadpepper/kato-dashboard:latest

# UptimeRobot
docker run -d \
  --name kato-dashboard \
  -p 3000:3000 \
  -e UPTIMEROBOT_API_KEY=u123456-your_readonly_token \
  ghcr.io/kwaadpepper/kato-dashboard:latest
```

---

## 2. `docker-compose.yml`

Create a `docker-compose.yml` file anywhere on your server:

```yaml
services:
  kato:
    image: ghcr.io/kwaadpepper/kato-dashboard:latest
    container_name: kato-dashboard
    ports:
      - "3000:3000"
    environment:
      UPTIME_KUMA_URL: "https://kuma.your-domain.com"
      UPTIME_KUMA_API_KEY: "uk1_your_api_key"
      KATO_DEFAULT_LOCALE: "en"
      KATO_DEFAULT_THEME: "dark"
    restart: unless-stopped
```

```bash
docker compose up -d
```

---

## 3. Run from Source

```bash
git clone https://github.com/Kwaadpepper/kato-dashboard.git
cd kato-dashboard
cp .env.example .env
npm install
npm run dev
```
