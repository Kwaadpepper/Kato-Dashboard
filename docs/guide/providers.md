# Monitoring Providers & Multi-Source Setup

Kato acts as a **Backend-For-Frontend (BFF)** that polls your monitoring backends on the server side, normalizes their metrics, and broadcasts real-time updates to connected browsers via Server-Sent Events (SSE).

Your API keys **never** leave the server.

---

## 1. Uptime Kuma

Kato connects to Uptime Kuma's native Prometheus `/metrics` endpoint.

### Step 1: Generate an API Key in Uptime Kuma
1. Open your **Uptime Kuma** dashboard.
2. Go to **Settings (⚙️) → API Keys**.
3. Click **Add API Key**, give it a name (e.g., `Kato Wallboard`), and copy the generated token (`uk1_...`).

> [!IMPORTANT]
> In Uptime Kuma, creating your first API Key permanently disables unauthenticated access to `/metrics` and requires HTTP Basic Auth with an empty username and the API Key as the password. Kato handles this automatically when `UPTIME_KUMA_API_KEY` is set.

### Step 2: Configure Kato
```dotenv
UPTIME_KUMA_URL=https://kuma.example.com
UPTIME_KUMA_API_KEY=uk1_your_secret_token
UPTIME_KUMA_POLL_INTERVAL=60000
```

---

## 2. UptimeRobot (API v3)

Kato uses the UptimeRobot REST API v3 with cursor pagination and zero extra log calls per poll cycle to stay well within the Free Plan quota (10 requests/min).

### Step 1: Retrieve your Read-Only API Key
1. Log in to **UptimeRobot**.
2. Navigate to **Integrations & API → API**.
3. Copy your **Main / Read-Only API Key**.

### Step 2: Configure Kato
```dotenv
UPTIMEROBOT_API_KEY=u123456-abcdef1234567890
UPTIMEROBOT_POLL_INTERVAL=30000
```

---

## 3. Multi-Instance Mode (`KATO_ADAPTERS`)

Need to monitor **two separate Uptime Kuma servers** (e.g., Production Cloud + Internal LAN) and an **UptimeRobot account** on a single TV screen?

Use `KATO_ADAPTERS` to define named adapter instances. Each instance runs on its own independent polling schedule and displays a deterministic color-coded **source badge** (`KP`, `KL`, `RM`) on every probe card.

```dotenv
# Declare comma-separated instance aliases
KATO_ADAPTERS=kuma_prod,kuma_lan,robot_main

# Instance 1: Production Uptime Kuma -> Badge "KP"
ADAPTER_KUMA_PROD_TYPE=uptimekuma
ADAPTER_KUMA_PROD_URL=https://kuma.prod.acme.io
ADAPTER_KUMA_PROD_API_KEY=uk1_prod_token
ADAPTER_KUMA_PROD_POLL_INTERVAL=30000

# Instance 2: Internal LAN Uptime Kuma -> Badge "KL"
ADAPTER_KUMA_LAN_TYPE=uptimekuma
ADAPTER_KUMA_LAN_URL=http://192.168.1.50:3001
ADAPTER_KUMA_LAN_API_KEY=uk1_lan_token
ADAPTER_KUMA_LAN_POLL_INTERVAL=15000

# Instance 3: UptimeRobot Cloud -> Badge "RM"
ADAPTER_ROBOT_MAIN_TYPE=uptimerobot
ADAPTER_ROBOT_MAIN_API_KEY=u987654-secret
ADAPTER_ROBOT_MAIN_POLL_INTERVAL=60000
```

> [!TIP]
> **Smart Type Inference**: If your instance alias contains `kuma` (e.g. `kuma_prod`) or `robot` (e.g. `robot_main`), you can omit `ADAPTER_<NAME>_TYPE` — Kato infers the provider automatically!
