# Monitoring Sources

Kato polls your monitoring services from the server and streams live status updates to your browser. Your API keys remain strictly on the server.

---

## 1. Uptime Kuma

1. In **Uptime Kuma**, open **Settings (⚙️) → API Keys**.
2. Click **Add API Key** and copy the generated token (`uk1_...`).
3. Configure Kato:

```dotenv
UPTIME_KUMA_URL=https://kuma.your-domain.com
UPTIME_KUMA_API_KEY=uk1_your_secret_token
UPTIME_KUMA_POLL_INTERVAL=60000
```

---

## 2. UptimeRobot

1. In **UptimeRobot**, open **Integrations & API → API** and copy your **Read-Only API Key**.
2. Configure Kato:

```dotenv
UPTIMEROBOT_API_KEY=u123456-abcdef1234567890
UPTIMEROBOT_POLL_INTERVAL=30000
```

---

## 3. Multi-Instance Setup (`KATO_ADAPTERS`)

To aggregate multiple Uptime Kuma servers and UptimeRobot accounts on a single screen, list their aliases in `KATO_ADAPTERS`. Each source gets its own color badge (`KP`, `KL`, `RM`) on every card:

```dotenv
KATO_ADAPTERS=kuma_prod,kuma_lan,robot_main

# Instance 1: Production Uptime Kuma -> Badge "KP"
ADAPTER_KUMA_PROD_URL=https://kuma.prod.acme.io
ADAPTER_KUMA_PROD_API_KEY=uk1_prod_token

# Instance 2: Internal LAN Uptime Kuma -> Badge "KL"
ADAPTER_KUMA_LAN_URL=http://192.168.1.50:3001
ADAPTER_KUMA_LAN_API_KEY=uk1_lan_token

# Instance 3: UptimeRobot -> Badge "RM"
ADAPTER_ROBOT_MAIN_API_KEY=u987654-secret
```

> [!TIP]
> If the alias contains `kuma` or `robot`, Kato detects the provider type automatically. Otherwise, set `ADAPTER_<ALIAS>_TYPE=uptimekuma` or `uptimerobot`.
