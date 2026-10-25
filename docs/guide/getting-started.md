# Quick Start (30 Seconds)

Kato is packaged as a lightweight, stateless container (`ghcr.io/kwaadpepper/kato-dashboard:latest`) with **zero database dependencies**. All state is maintained in memory and synchronized automatically with your monitoring providers.

---

## Option 1: One-Liner `docker run` (Fastest)

### Try the Interactive Multi-Source Demo
Launch Kato with 50 realistic probes across simulated sources (`kuma-prod`, `kuma-lan`, `uptimerobot`):

```bash
docker run -d \
  --name kato-dashboard \
  -p 3000:3000 \
  ghcr.io/kwaadpepper/kato-dashboard:latest
```

Open **`http://localhost:3000`** in your browser.

### Connect to Uptime Kuma or UptimeRobot (Auto-Detected)
You do not even need to set `KATO_ADAPTER` — providing `UPTIME_KUMA_URL` or `UPTIMEROBOT_API_KEY` automatically activates the corresponding adapter:

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

## Option 2: Standalone `docker-compose.yml`

No need to clone the repository. Create a `docker-compose.yml` file anywhere on your server:

```yaml
services:
  kato:
    image: ghcr.io/kwaadpepper/kato-dashboard:latest
    container_name: kato-dashboard
    ports:
      - "3000:3000"
    environment:
      # Auto-detects Uptime Kuma or UptimeRobot when credentials are set:
      UPTIME_KUMA_URL: "https://kuma.your-domain.com"
      UPTIME_KUMA_API_KEY: "uk1_your_api_key"
      # Optional UI defaults:
      KATO_DEFAULT_LOCALE: "en"
      KATO_DEFAULT_THEME: "dark"
    restart: unless-stopped
```

Then start the service:

```bash
docker compose up -d
```

> [!TIP]
> The official Docker image includes a built-in `HEALTHCHECK` targeting `http://127.0.0.1:3000/api/health`, so Docker and Portainer automatically report container health status.

---

## Option 3: From Source (Node.js)

If you want to customize Kato or contribute to development:

### Prerequisites
- **Node.js** 20.x or 22.x+
- **npm** 10.x+

```bash
# 1. Clone the repository
git clone https://github.com/Kwaadpepper/kato-dashboard.git
cd kato-dashboard

# 2. Install dependencies
npm install

# 3. Copy environment template (and optionally docker-compose template)
cp .env.example .env
cp docker-compose.example.yml docker-compose.yml

# 4. Start development server with hot-reload
npm run dev
```

For production Node.js execution:

```bash
npm run build
node build
```
